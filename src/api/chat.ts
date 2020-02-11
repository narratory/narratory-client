import { call } from "./call"
import { Agent } from "../index"
import { AbstractBotTurn } from "../interfaces"
import Axios from "axios"
import { CUSTOM_START_URL } from "../settings"
const fs = require("fs")

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
  removeHistoryDuplicates: true
})

const getMessage = (message: string, prompt: boolean) => `Bot: ${message + (prompt ? "\n>> " : "")}`

const getCustomStartEvent = async (agent: Agent, startingTurn: AbstractBotTurn | number): Promise<string> => {
  const result = await Axios.post(CUSTOM_START_URL, { agent, startingTurn })
  return result.data
}

export async function chat({
  agent,
  startingTurn,
  script,
  recordFile
}: {
  agent: Agent
  startingTurn?: AbstractBotTurn | number
  script?: string[]
  recordFile?: string
}) {
  const logger = recordFile ? fs.createWriteStream(recordFile, {
      flags: "a" // 'a' means appending (old data will be preserved)
    })
  : null

  const _script = !script || !Array.isArray(script) || script.length == 0 ? [] : script.filter(Boolean).reverse()

  const startEvent = startingTurn ? await getCustomStartEvent(agent, startingTurn) : "WELCOME" // Get start-event

  const response = await call({
    googleCredentials: agent.googleCredentials,
    language: agent.language,
    event: startEvent
  }) // Initiate the chat with the welcome event

  if (response.sessionId) {
    console.log(`Chat started with ${agent.agentName} (session id: ${response.sessionId})\n`)
  } else {
    console.log(`Chat could not be started with ${agent.agentName}\n`)
  }

  await handleResponseWithScript({ agent, response, script: _script, logger }) // And then, recursively, handle responses
}

export function handleResponseWithChat({
  agent,
  response,
  logger
}: {
  agent: Agent
  response: any
  logger: any
}) {
  response.messages.map((message, index) => {
    if (index == response.messages.length - 1) {
      // If last message, we make a prompt and then call our agent with the input
      if (response.endOfConversation) {
        console.log(getMessage(message.text, false))
        console.log("\nEnd of conversation")
        logger && logger.end()
        process.exit()
      } else {
        readline.question(getMessage(message.text, true), (input: string) => {
          if (input !== "") {
            logger && logger.write(`${input}\n`)
            call({
              ...response,
              language: agent.language,
              googleCredentials: agent.googleCredentials,
              message: input
            }).then(response => handleResponseWithChat({ agent, response, logger }))
          } else {
            handleResponseWithChat({
              agent,
              response: {
                ...response,
                messages: [
                  {
                    text: "<Input can't be empty>",
                    fromUser: false
                  }
                ]
              },
              logger
            })
          }
        })
      }
    } else {
      console.log(getMessage(message.text, false)) // Otherwise we just print the message
    }
  })
}

async function handleResponseWithScript({
  agent,
  response,
  script,
  logger
}: {
  agent: Agent
  response: any
  script: string[]
  logger: any
}) {
  if (script.length == 0) {
    handleResponseWithChat({ agent, response, logger })
  } else {
    for (let index = 0; index < response.messages.length; index++) {
      const message = response.messages[index]
      console.log(getMessage(message.text, false))
      if (index == response.messages.length - 1) {
        // If last message, we make a prompt and then call our agent with the input
        if (response.endOfConversation) {
          console.log("\nEnd of conversation")
          logger && logger.end()
          process.exit()
        } else {
          const input = script.pop()
          console.log("User: " + input)
          
          logger && logger.write(`${input}\n`)

          const _response = await call({
            ...response,
            language: agent.language,
            googleCredentials: agent.googleCredentials,
            message: input
          })
          await handleResponseWithScript({ agent, response: _response, script, logger })
        }
      }
    }
  }
}
