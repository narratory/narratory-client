import { getNamedIntentsFromFolder } from "../helpers"
import { validate } from "../api/validate"
import { getAgent } from "./agent"
import { validateAgentCredentialsFormat } from "./helpers"

export const runValidate = async () => {
  console.log(`Validating agent [Ctrl/Cmd + C to exit]\n`)
  const intents = await getNamedIntentsFromFolder("src")

  const agent = getAgent()

  validateAgentCredentialsFormat(agent)

  await validate({ agent, intents, local: process.argv.includes("!local") })
}
