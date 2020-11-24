import { call } from "./call"
import { Agent, DEFAULT_LANGUAGE, DEFAULT_REGION, NarratoryResponse } from "narratory-lib"
import { printDebugMessage } from "../helpers"
import * as fs from "fs"
import * as readline from "readline"
import chalk from "chalk"

let cmdInterface: readline.Interface

const getMessage = (message: string, prompt: boolean) =>
  `${chalk.cyan("Bot:")} ${chalk.white(message) + (prompt ? "\n>> " : "")}`

export async function chat({
  agent,
  local = false,
  debug = false,
  startIndex,
  script,
  recordFile,
}: {
  agent: Agent
  local?: boolean
  debug: boolean
  startIndex?: number
  script?: string[]
  recordFile?: string
}) {
  const logger = recordFile
    ? fs.createWriteStream(recordFile, {
        flags: "a", // 'a' means appending (old data will be preserved)
      })
    : null

  const _script =
    !script || !Array.isArray(script) || script.length == 0
      ? []
      : script.filter(Boolean).reverse()

  const startEvent = startIndex > 0 ? `b-${startIndex}` : "WELCOME" // Get start-event

  const response = await call({
    googleCredentials: agent.googleCredentials,
    language: agent.language,
    region: agent.region ? agent.region : DEFAULT_REGION,
    event: startEvent,
    local,
  }) // Initiate the chat with the welcome event

  if (local) {
    console.log("[Using local Narratory endpoint]\n")
  }

  if (response.sessionId) {
    console.log(
      `Chat started with ${agent.agentName} (session id: ${response.sessionId})\n`
    )
  } else {
    console.log(`Chat could not be started with ${agent.agentName}\n`)
  }

  await handleResponseWithScript({
    agent,
    response,
    local,
    script: _script,
    logger,
    debug,
  }) // And then, recursively, handle responses
}

function handleResponseWithChat({
  agent,
  response,
  local,
  logger,
  debug,
}: {
  agent: Agent
  local?: boolean
  response: any
  logger: any
  debug: boolean
}) {
  if (!cmdInterface) {
    cmdInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      removeHistoryDuplicates: true,
      terminal: false // To avoid duplicate key-presses
    })
  }

  if (debug) {
    printDebugMessage(response)
  }
  response.messages.map((message, index) => {
    if (index == response.messages.length - 1) {
      // If last message, we make a prompt and then call our agent with the input
      if (response.endOfConversation) {
        console.log(getMessage(message.text, false))
        console.log("\nEnd of conversation")
        logger && logger.end()
        process.exit()
      } else {
        cmdInterface.question(
          getMessage(message.text, true),
          (input: string) => {
            if (input !== "") {
              logger && logger.write(`${input}\n`)
              call({
                ...response,
                language: agent.language,
                googleCredentials: agent.googleCredentials,
                message: input,
                region: agent.region ? agent.region : DEFAULT_REGION,
                local,
              }).then((response) =>
                handleResponseWithChat({
                  agent,
                  response,
                  local,
                  logger,
                  debug,
                })
              )
            } else {
              handleResponseWithChat({
                agent,
                response: {
                  ...response,
                  messages: [
                    {
                      text: "<Input can't be empty>",
                      fromUser: false,
                    },
                  ],
                },
                local,
                logger,
                debug,
              })
            }
          }
        )
      }
    } else {
      console.log(getMessage(message.text, false)) // Otherwise we just print the message
    }
  })
}

async function handleResponseWithScript({
  agent,
  response,
  local,
  script,
  logger,
  debug,
}: {
  agent: Agent
  response: NarratoryResponse
  local?: boolean
  script: string[]
  logger: any
  debug: boolean
}) {
  if (script.length == 0) {
    handleResponseWithChat({ agent, response, local, logger, debug })
  } else {
    if (debug) {
      printDebugMessage(response)
    }
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
          console.log("User: " + input + " [Automatic replay]")
          logger && logger.write(`${input}\n`)

          const _response = await call({
            ...response,
            language: agent.language,
            googleCredentials: agent.googleCredentials,
            region: agent.region ? agent.region : DEFAULT_REGION,
            message: input,
            local,
          })
          await handleResponseWithScript({
            agent,
            response: _response,
            local,
            script,
            logger,
            debug,
          })
        }
      }
    }
  }
}
