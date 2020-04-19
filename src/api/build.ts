import { Agent } from "../index"
import axios from "axios"
import { CREATE_AGENT_URL, CREATE_AGENT_URL_LOCAL } from "../settings"
import { Language } from "../data/languages"
import { Intent } from "../index"

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
    console.log("USING LOCAL CREATE SERVER")
  }

  console.log("Creating and training agent. This could take up to 60 seconds. Hold on!")

  if (!agent.language) {
    agent.language = Language.English
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
      return null
    }
  } catch (error) {
    console.log("Something went wrong in agent creation. Error message: ", error.message)
    return null
  }
}
