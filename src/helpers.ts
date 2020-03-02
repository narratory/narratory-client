import axios from "axios"
import dialogflow from "dialogflow"
import { struct } from "pb-util"
const fs = require("fs")
import { Intent } from "./index"

import { GoogleCredentials } from "./interfaces"

export const callApi = async (url: string, data: object): Promise<any> => {
  const repson = await axios({
    url,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    data: JSON.stringify(data)
  })

  return await repson.data
}

export function isEmpty(obj: Object) {
  return Object.keys(obj).length === 0
}

export function getStartTurnIndex(index: string, maxIndex: number): number {
  if (!isNaN(index as any) && parseInt(index) <= maxIndex && parseInt(index) > 1) {
    return parseInt(index)
  } else {
    return undefined
  }
}

export async function listDir(dir: string) {
  try {
    return fs.promises.readdir(dir, { withFileTypes: true })
  } catch (err) {
    if (err) {
      console.error("Error occured while reading directory!", err)
    }
  }
}

export async function readFile(path: string) {
  try {
    return fs.promises.readFile(path)
  } catch (err) {
    if (err) {
      console.error("Error occured while reading file!", err)
    }
  }
}

export const parseDialogflowResponse = (
  results: any,
  oldContexts: any[],
  sessionId: string
): {
  messages: { text: string; richContent: boolean; fromUser: boolean }[]
  contexts: any[]
  sessionId: string
  endOfConversation: boolean
} => {
  const messages = results.fulfillmentMessages[0].text.text

  let endOfConversation = false

  try {
    endOfConversation = results.webhookPayload
      ? (struct.decode(results.webhookPayload) as any).endOfConversation
      : false
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
    contexts:
      results.intent && results.intent.isFallback && results.intent.displayName == "Default Fallback Intent"
        ? oldContexts
        : results.outputContexts, // If we get a fallback, we want to keep contexts from before
    sessionId,
    endOfConversation
  }
}

let sessionClient

export const getSessionClient = (googleCredentials: GoogleCredentials) => {
  if (!sessionClient) {
    sessionClient = new dialogflow.SessionsClient({
      credentials: googleCredentials
    })
  }
  return sessionClient
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export function getVariableName<TResult>(name: () => TResult) {
  var m = new RegExp("return (.*);").exec(name + "")
  if (m == null) throw new Error("The function does not contain a statement matching 'return variableName;'")
  return m[1]
}

const getIntentNames = (_exports: any): Array<any> => {
  const intentNames: Array<any> = []
  if (typeof _exports === "object") { // Should always be true
    Object.keys(_exports).forEach(key => { // Loop over all exported variables
      const exportedVariable = _exports[key]
      if (typeof exportedVariable == "object" && "examples" in exportedVariable) { // Identify intents
        intentNames.push([key, exportedVariable])
      }
    })
  }
  return intentNames
}

export const getNamedIntentsFromFolder = async (path: string, intentNames?: {[key: string]: Intent}) => {
  if (!intentNames) {
    intentNames = {}
  }
  const files = await listDir(path)

  for (const file of files) {
    const fileName = file.name
    if (file.isFile()) {
      if (fileName.includes(".ts")) {
        try {
          const jsPath = "out/" + path.slice(4) + "/" + fileName.replace(".ts", ".js")
          const filePath = `${process.cwd()}/${jsPath}`

          let _exports = require(filePath)
          getIntentNames(_exports).forEach(intentArr => {
            intentNames[intentArr[0]] = intentArr[1]
          })
        } catch (err) {
          console.log(`Skipped file ${fileName} due to error. Error: ${err}`)
        }
      }
    } else {
      await getNamedIntentsFromFolder(`${path}/${fileName}`, intentNames)
    }
  }
  return intentNames
}