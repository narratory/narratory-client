import { isEmpty, getSessionClient, parseDialogflowResponse } from "../helpers"
import { Agent } from "../index"
import { API_VERSION, DIALOGFLOW_RETRY_ATTEMPTS, DEFAULT_LANGUAGE } from "../settings"
import { GoogleCredentials } from "../interfaces"
import { Language } from "../data/languages"
const v4 = require("uuid/v4")

export const call = async ({
  googleCredentials,
  language = DEFAULT_LANGUAGE,
  sessionId,
  contexts,
  event,
  message
}: {
  googleCredentials: GoogleCredentials
  language?: Language
  sessionId?: string
  contexts?: any
  event?: string
  message?: string
}): Promise<{
  messages: {
    text: string
    fromUser: boolean
  }[]
  contexts: any[]
  sessionId: string
  endOfConversation: boolean
}> => {
  let attempts = 0
  const _sessionId = sessionId ? sessionId : v4()
  const sessionClient = getSessionClient(googleCredentials)
  const sessionPath = sessionClient.sessionPath(googleCredentials.project_id, _sessionId)
  const previousContexts = contexts

  const input = event
    ? {
        // Input for EVENTS
        session: sessionPath,
        queryInput: {
          event: {
            name: event,
            languageCode: language
          }
        }
      }
    : {
        // Input for MESSAGES
        session: sessionPath,
        queryInput: {
          text: {
            text: message,
            languageCode: language
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

    let responses = (await sessionClient.detectIntent(input)).filter(Boolean) // Since sometimes, the responses array seems to have two extra, "undefined" values

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
    while (isEmpty(results.fulfillmentMessages) && attempts < DIALOGFLOW_RETRY_ATTEMPTS) {
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
      return parseDialogflowResponse(results, previousContexts, _sessionId)
    }
  } catch (err) {
    return {
      messages: [
        {
          text: "Woops. I had issues connecting to the server. Try again soon!",
          fromUser: false
        }
      ],
      contexts: undefined,
      sessionId: undefined,
      endOfConversation: true
    }
  }
}
