import { Agent, Intent } from "../"
import { VALIDATE_AGENT_URL, VALIDATE_AGENT_URL_LOCAL } from "../settings"
import { printJson } from "../helpers"
import Axios from "axios"

export const validate = async ({
  agent,
  intents,
  local = false,
}: {
  agent: Agent
  intents: { [key: string]: Intent }
  local: boolean
}) => {
  if (local) {
    console.log("USING LOCAL VALIDATE FUNCTION")
  }

  console.log("Validating agent, hold on!")

  try {
    const response = await Axios.post(
      local ? VALIDATE_AGENT_URL_LOCAL : VALIDATE_AGENT_URL,
      {
        agent: JSON.stringify(agent),
        intents: JSON.stringify(intents),
      },
      {
        headers: {
          authorization: `Bearer ${agent.narratoryKey}`,
        },
      }
    )

    const validationResult = response.data.validationResult
    const fileName = `validation-${Date.now()}.json`
    printJson(fileName, validationResult.validationErrors, "logs")
    
    console.log(`Agent validation results:`)
    console.log(
      `Issues: ${validationResult.critical} critical, ${validationResult.error} errors, ${validationResult.warning} warnings & ${validationResult.info} info`
    )
    
    console.log(`Results printed in logs/${fileName}`)
    
    return response
  } catch (error) {
    console.log("Something went wrong in agent validation. Error message: ", error.message)
    return null
  }
}
