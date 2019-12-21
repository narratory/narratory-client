import { struct } from "pb-util"
import { isEmpty } from "./helpers"
import dialogflow from "dialogflow"
import { Agent } from "./index"
import { API_VERSION } from "./settings";
const v4 = require('uuid/v4');

const parseDialogflowResponse = async (results, oldContexts, sessionId) => {
  const errorMessages = [
    "Woops! It seems like I can't connect to Narratory.",
    "Did you remember to put in the fulfillment url", // and the right authentication key",
    "in the Dialogflow console's Fulfillment page?",
    "The fulfillment url is https://europe-west1-narratory-1.cloudfunctions.net/fulfill_" + API_VERSION
  ]

  const messages = isEmpty(results.fulfillmentMessages) ? errorMessages : results.fulfillmentMessages[0].text.text

  let endOfConversation = false

  try {
    endOfConversation = results.webhookPayload ? (struct.decode(results.webhookPayload) as any).endOfConversation : false
  } catch (err) {
    console.log("=== Error: Failed to parse if turn was end of conversation. Assuming it wasnt the end.")
  }

  return {
    messages: messages.map(message => {
      return {
        text: message,
        richContent: false,
        fromUser: false
      }
    }),
    contexts: (results.intent && results.intent.isFallback && results.intent.displayName == "Default Fallback Intent") ? oldContexts : results.outputContexts, // If we get a fallback, we want to keep contexts from before
    customEvent: messages.customEvent ? messages.customEvent : null,
    sessionId,
    endOfConversation
  }
}

let sessionClient

const getSessionClient = (agent: Agent) => {
  if (!sessionClient) {
    sessionClient = new dialogflow.SessionsClient({
      credentials: {
        ...agent.googleCredentials
      }
    })
  }
  return sessionClient
}

interface TurnData {
  sessionId?: string
  contexts?: any
  event?: string
  message?: string
}

export default async (agent: Agent, turnData: TurnData) => {
  const firstSession = !turnData.sessionId
  const sessionId = !firstSession ? turnData.sessionId : v4()
  const sessionPath = getSessionClient(agent).sessionPath(agent.googleCredentials.project_id, sessionId)
  const previousContexts = turnData.contexts

  const input = turnData.event ? { // Input for EVENTS
    session: sessionPath,
    queryInput: {
      event: {
        name: turnData.event,
        languageCode: agent.language
      }
    }
  } : { // Input for MESSAGES
      session: sessionPath,
      queryInput: {
        text: {
          text: turnData.message,
          languageCode: agent.language
        }
      },
      queryParams: {
        contexts: previousContexts
      }
    }

  try {
    if (process.env.NODE_ENV == "development") {
      console.log("===== Calling Dialogflow")
    }
    let responses = await sessionClient.detectIntent(input)
    let results = responses[0].queryResult

    // If we get an error the first attempt, we do one retry. The nature of cloud functions is unfortunately that slow-starts might take enough time for dialogflow to neglect the webhook call
    if (firstSession && isEmpty(results.fulfillmentMessages)) {
      if (process.env.NODE_ENV == "development") {
        console.log("===== Got error, trying again")
      }
      responses = await sessionClient.detectIntent(input)
      results = responses[0].queryResult
    }

    if (process.env.NODE_ENV == "development" && results.diagnosticInfo) {
      console.log(JSON.stringify(struct.decode(results.diagnosticInfo))) // Prints the webhook delay
    }
    const response = await parseDialogflowResponse(results, previousContexts, sessionId)
    if (process.env.NODE_ENV == "development") {
      console.log("===== Got response from Dialogflow")
    }
    return response
  } catch (err) {
    console.log(err)
    return {
      messages: [{ text: "Woops. I had issues connecting to the server, it seems", fromUser: false }],
      contexts: [],
      sessionId: undefined
    }
  }
};