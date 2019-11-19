import { struct } from "pb-util"
import { isEmpty } from "./helpers"
import dialogflow from "dialogflow"
import { Agent } from "./index"
const v4 = require('uuid/v4');

const parseDialogflowResponse = async (results, oldContexts, sessionId) => {
  const message: any = results.fulfillmentMessages[0].payload ? struct.decode(results.fulfillmentMessages[0].payload) : {
    responses: [{
      text: [results.fulfillmentText],
      richContent: false
    }]
  }

  if (isEmpty(message)) {
    message.responses = [{
      text: ["Here, we would normally have a chat. Not right now however, I seem to have connection issues to the AI overlord. Try again later!"],
      richContent: false
    }]
  }

  return {
    messages: message.responses.map(response => {
      return {
        ...response,
        fromUser: false
      }
    }),
    contexts: (results.intent && results.intent.isFallback && results.intent.displayName == "Default Fallback Intent") ? oldContexts : results.outputContexts, // If we get a fallback, we want to keep contexts from before
    customEvent: message.customEvent ? message.customEvent : null,
    sessionId
  }
}

let sessionClient

const getSessionClient = (agent: Agent) => {
  if (!sessionClient) {
    sessionClient = new dialogflow.SessionsClient({
      credentials: {
        ...agent.credentials
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
  const _sessionId = turnData.sessionId ? turnData.sessionId : v4()
  const sessionPath = getSessionClient(agent).sessionPath(agent.credentials.project_id, _sessionId)
  const previousContexts = turnData.contexts

  const input = turnData.event ? { // Input for EVENTS
    "session": sessionPath,
    "queryInput": {
      "event": {
        "name": turnData.event,
        "languageCode": "en-US"
      }
    }
  } : { // Input for MESSAGES
      "session": sessionPath,
      "queryInput": {
        "text": {
          "text": turnData.message,
          "languageCode": "en-US"
        }
      },
      "queryParams": {
        "contexts": previousContexts
      }
    }

  try {
    if (process.env.NODE_ENV == "development") {
      console.log("===== Calling Dialogflow")
    }
    const responses = await sessionClient.detectIntent(input)
    const results = responses[0].queryResult
    
    if (process.env.NODE_ENV == "development" && results.diagnosticInfo) {
      console.log(JSON.stringify(struct.decode(results.diagnosticInfo))) // Prints the webhook delay
    }
    const response = await parseDialogflowResponse(results, previousContexts, _sessionId)
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