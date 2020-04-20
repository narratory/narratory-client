import { getNamedIntentsFromFolder } from "../helpers"
import { validate } from "../api/validate"
import { agent } from "./agent"

export const runValidate = async () => {
  console.log(`Validating agent [Ctrl/Cmd + C to exit]\n`)
  const intents = await getNamedIntentsFromFolder("src")
  await validate({ agent, intents, local: process.argv.includes("!local") })
}
