import { struct } from "pb-util"
import { isEmpty, getSessionClient, parseDialogflowResponse } from "../helpers"
import { API_VERSION, DIALOGFLOW_RETRY_ATTEMPTS } from "../settings"
import { DEFAULT_LANGUAGE, DialogflowRegion, GoogleCredentials, Language, NarratoryResponse } from "narratory-lib"

import v4 from "uuid/v4"

export const call = async ({
  googleCredentials,
  language = DEFAULT_LANGUAGE,
  region,
  sessionId,
  contexts,
  event,
  message,
  local,
  payload
}: {
  googleCredentials: GoogleCredentials
  language?: Language
  region: DialogflowRegion
  sessionId?: string
  contexts?: any
  event?: string
  message?: string
  local?: boolean
  payload?: any
}): Promise<NarratoryResponse> => {
  let attempts = 0
  const _sessionId = sessionId ? sessionId : v4()
  const sessionClient = getSessionClient(googleCredentials)
  const sessionPath = sessionClient.projectLocationAgentSessionPath(googleCredentials.project_id, region, _sessionId)
  const previousContexts = contexts
  let timestampBefore: number
  let timestampAfter: number

  let input: any = event
    ? {
        // Input for EVENTS
        session: sessionPath,
        queryInput: {
          event: {
            name: event,
            languageCode: language,
          },
        },
      }
    : {
        // Input for MESSAGES
        session: sessionPath,
        queryInput: {
          text: {
            text: message,
            languageCode: language,
          },
        },
        queryParams: {
          contexts: previousContexts,
        },
      }

  if (local) {
    input.queryParams = {
      ...input.queryParams,
      payload: struct.encode({
        localDevelopment: true,
        ...payload
      }),
    }
  }

  try {
    if (process.env.NODE_ENV == "development") {
      console.log("===== Calling Dialogflow")
    }

    attempts++
    timestampBefore = Date.now()
    let responses : any[] = (await sessionClient.detectIntent(input)).filter(Boolean) // Since sometimes, the responses array seems to have two extra, "undefined" values
    timestampAfter = Date.now()

    // If we get an error the first attempt, we do one retry. The nature of cloud functions is unfortunately that slow-starts might take enough time for dialogflow to neglect the webhook call
    if (responses.length == 0 || !responses[0].webhookStatus || ![0, 4].includes(responses[0].webhookStatus.code)) {
      const errorMessages = [
        "Woops! It seems like I can't connect to Narratory.",
        "Please check your internet connection and try again!",
      ]
      return {
        messages: errorMessages.map((msg) => {
          return {
            text: msg,
            fromUser: false,
            richContent: false
          }
        }),
        contexts: [],
        sessionId: undefined,
        endOfConversation: true,
        rawResponse: responses,
        attempts,
        handover: false
      }
    }

    let results = responses[0].queryResult

    // Retries if timed out
    while (isEmpty(results.fulfillmentMessages) && attempts < DIALOGFLOW_RETRY_ATTEMPTS) {
      attempts++
      if (process.env.NODE_ENV == "development") {
        console.log("===== Got error, trying again")
      }
      timestampBefore = Date.now()
      responses = await sessionClient.detectIntent(input)
      timestampAfter = Date.now()
      results = responses[0].queryResult
    }

    if (isEmpty(results.fulfillmentMessages)) {
      throw Error("No fulfillment messages returned from Dialogflow")
    } else {
      return {
        ...parseDialogflowResponse(results, previousContexts, _sessionId),
        responseTimeTotal: timestampAfter - timestampBefore,
        rawResponse: responses,
        attempts,
      }
    }
  } catch (err) {
    return {
      messages: [
        {
          text: "Woops. Something went wrong. Try again soon!",
          richContent: false,
          fromUser: false,
        },
      ],
      contexts: undefined,
      sessionId: undefined,
      endOfConversation: true,
      rawResponse: undefined,
      attempts,
      handover: false
    }
  }
}
