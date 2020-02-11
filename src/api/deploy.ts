import { Agent } from "../"
import { DEPLOY_AGENT_URL_LOCAL, DEPLOY_AGENT_URL } from "../settings"
import Axios from "axios"

export const deploy = async ({ agent, version, local = false }: { agent: Agent, version: string,local: boolean }) => {
    if (local) {
      console.log("USING LOCAL CREATE SERVER")
    }
  
    console.log("Deploying the latest built agent. Hold on!")
  
    try {
      const response = await Axios.post(
        local ? DEPLOY_AGENT_URL_LOCAL : DEPLOY_AGENT_URL,
        {
          projectId: agent.googleCredentials.project_id,
          version
        },
        {
          headers: {
            authorization: `Bearer ${agent.narratoryKey}`
          }
        }
      )

      if (response.data && response.status == 200) {
        console.log(`Agent deployed successfully`)
        return response
      } else {
        console.log("Something went wrong in agent deployment. Message: ", response.data.message)
        return null
      }
    } catch (error) {
      console.log("Something went wrong in agent deployment. Error message: ", error.message)
      return null
    }
  }
  