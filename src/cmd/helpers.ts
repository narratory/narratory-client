import { Agent } from "narratory-lib"

export const validateAgentCredentialsFormat = (agent: Agent) => {
  if (!agent.narratoryKey) {
    console.log(
        "No Narratory credentials supplied in the narratory_credentials.json file. Get your key at https://app.narratory.io and then try again!"
      )
      process.exit()
  } else if (
    !agent.googleCredentials ||
    !agent.googleCredentials.project_id ||
    !agent.googleCredentials.client_email ||
    !agent.googleCredentials.private_key
  ) {
    console.log(
      "No Google Credentials supplied. Please make sure to have a Google service account JSON key in your google_credentials.json file. Instructions here: https://narratory.io/docs/setup"
    )
    process.exit()
  }
}
