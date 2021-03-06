import { Agent, Intent, DEFAULT_REGION, DEFAULT_LANGUAGE } from "narratory-lib"
import { CREATE_AGENT_URL, CREATE_AGENT_URL_LOCAL } from "../settings"
import axios from "axios"

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
    agent.language = DEFAULT_LANGUAGE
  }

  if (!agent.region) {
    agent.region = DEFAULT_REGION
  }
  
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
      process.exit()
    }
  } catch (error) {
    console.log("Something went wrong in agent creation. Error message: ", error.message)
    process.exit()    
  }
}
