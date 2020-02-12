import axios from 'axios'
import dialogflow from "dialogflow"
import { struct } from "pb-util"
const fs = require("fs")

import { Agent } from "./index"
import { GoogleCredentials } from './interfaces'

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
    return Object.keys(obj).length === 0;
}

export function getStartTurnIndex(index: string, maxIndex: number): number {
    if (!isNaN(index as any) &&
        parseInt(index) <= maxIndex &&
        parseInt(index) > 1) {
        return parseInt(index)
    }
    else {
        return undefined
    }
}

export async function listDir(dir: string) {
    try {
        return fs.promises.readdir(dir);
    } catch (err) {
        if (err) {
            console.error('Error occured while reading directory!', err);
        }
    }
}

export async function readFile(path: string) {
    try {
        return fs.promises.readFile(path);
    } catch (err) {
        if (err) {
            console.error('Error occured while reading file!', err);
        }
    }
}

export const parseDialogflowResponse = (results: any, oldContexts: any[], sessionId: string): {
  messages: { text: string, richContent: boolean, fromUser: boolean }[],
  contexts: any[],
  sessionId: string,
  endOfConversation: boolean
} => {
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