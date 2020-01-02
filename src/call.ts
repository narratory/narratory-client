import { struct } from "pb-util"
import { isEmpty } from "./helpers"
import dialogflow from "dialogflow"
import { Agent } from "./index"
import { API_VERSION } from "./settings";
const v4 = require('uuid/v4');

const parseDialogflowResponse = (results: any, oldContexts: any[], sessionId: string) => {
  const messages = results.fulfillmentMessages[0].text.text

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
  let attempts = 0
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
    attempts++

    let responses = (await sessionClient.detectIntent(input))
      .filter(Boolean) // Since sometimes, the responses array seems to have two extra, "undefined" values

    // If we get an error the first attempt, we do one retry. The nature of cloud functions is unfortunately that slow-starts might take enough time for dialogflow to neglect the webhook call
    if (responses.length == 0 || !responses[0].webhookStatus || ![0, 4].includes(responses[0].webhookStatus.code)) {
      const errorMessages = [
        "Woops! It seems like I can't connect to Narratory.",
        "Did you remember to put in the fulfillment url",
        "in the Dialogflow console's Fulfillment page?",
        "The fulfillment url is https://europe-west1-narratory-1.cloudfunctions.net/fulfill_" + API_VERSION
      ]
      return {
        messages: errorMessages.map(msg => {
          return {
            text: msg,
            fromUser: false
          }
        }),
        contexts: [],
        sessionId: undefined,
        endOfConversation: true
      }
    }

    let results = responses[0].queryResult

    // Retries if timed out
    while (isEmpty(results.fulfillmentMessages) && attempts <= 2) {
      attempts++
      if (process.env.NODE_ENV == "development") {
        console.log("===== Got error, trying again")
      }
      responses = await sessionClient.detectIntent(input)
      results = responses[0].queryResult
    }

    if (isEmpty(results.fulfillmentMessages)) {
      throw Error("No fulfillment messages returned from Dialogflow")
    } else {
      return parseDialogflowResponse(results, previousContexts, sessionId)
    }
  } catch (err) {
    return {
      messages: [{ text: "Woops. I had issues connecting to the server, it seems", fromUser: false }],
      contexts: [],
      sessionId: undefined
    }
  }
};