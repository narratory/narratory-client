import { Agent } from "../index"
import axios from "axios"
import { CREATE_AGENT_URL, CREATE_AGENT_URL_LOCAL } from "../settings"
import { Language } from "../data/languages"
import { Intent } from "../index"
import * as fs from "fs"
import { Narrative } from "../interfaces"

export const hashCode = function (str: string) {
  const seed = 0
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return `${4294967296 * (2097151 & h2) + (h1 >>> 0)}`
}

const stringifyAgent = (agent: Agent) => {
  const replacer = (key: string, value: any) => {
    if (key === "goto") {
      if (typeof value === "object") {
        if ("botInitiatives" in value) { // Narrative
          return "n-" + hashCode(JSON.stringify(value))
        } else { // BotTurn
          return "b-" + hashCode(JSON.stringify(value))
        }
      } else {
        return value // HANDOVER or EXIT
      }
    } else {
      return value
    }
  }
  return JSON.stringify(agent, replacer, 2)
}

export const printJson = (fileName: string, data: any, directory: string = "logs") => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory)
  }

  const str = typeof data === "string" ? data : JSON.stringify(data, null, 2)

  fs.writeFile((directory ? `${directory}/` : "") + fileName, str, (err: any) => {
    if (err) {
      console.log(err)
    } else {
      console.log("Saved json to file " + fileName)
    }
  })
}

export const build = async ({
  agent,
  intents,
  dry = false,
  skipSleepAfterTraining,
  local = false,
}: {
  agent: Agent
  intents: { [key: string]: Intent }
  dry: boolean
  skipSleepAfterTraining: boolean
  local: boolean
}) => {
  if (local) {
    console.log("[Using local Narratory endpoint]\n")
  }

  if (dry) {
    console.log("[Running dry]\n")
  }

  console.log("Creating and training agent. This could take up to 20 seconds. Hold on!")

  if (!agent.language) {
    agent.language = Language.English
  }

  const enrichedAgent = {
    ...agent,
    narratives: agent.narratives.map(narrative => {
      return {
        ...narrative,
        label: `n-${hashCode(JSON.stringify(narrative))}`
      }
    })
  }
  
  printJson("agentBefore.json", JSON.stringify(agent, null, 2))
  printJson("agentAfter.json", stringifyAgent(enrichedAgent))
  
  try {
    const response = await axios.post(
      local ? CREATE_AGENT_URL_LOCAL : CREATE_AGENT_URL,
      {
        agent: JSON.stringify(agent),
        intents: JSON.stringify(intents),
        dry,
        skipSleepAfterTraining,
      },
      {
        headers: {
          authorization: `Bearer ${agent.narratoryKey}`,
        },
      }
    )

    if (response.data && response.data.status == 200) {
      console.log(`Agent created and trained successfully in ${(response.data.timeElapsed / 1000).toFixed(0)} seconds`)
      return response
    } else {
      console.log(
        "Something went wrong in agent creation.",
        response.data.message ? "Message: " + response.data.message : "No message"
      )
      return null
    }
  } catch (error) {
    console.log("Something went wrong in agent creation. Error message: ", error.message)
    return null
  }
}
