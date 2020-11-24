import { getNamedIntentsFromFolder } from "../helpers"
import { build } from "../api/build"
import { checkAlive } from "../api/aliveCheck"
import { getAgent } from "./agent"
import { compileTypescript } from "./compileTypescript"
import { validateAgentCredentialsFormat } from "./helpers"

// Update our agent

export const runBuild = async ({
  skipSleepAfterTraining = false,
}: { skipSleepAfterTraining?: boolean } = {}) => {
  console.log("Building agent [Ctrl/Cmd + C to exit]")
  try {
    await compileTypescript()
  } catch (err) {
    console.error(err.message)
    process.exit()
  }

  const agent = getAgent()
  
  validateAgentCredentialsFormat(agent)

  const intents = getNamedIntentsFromFolder("src")

  const local = process.argv.includes("!local")

  const response = await build({
    agent,
    intents,
    skipSleepAfterTraining,
    dry: process.argv.includes("!dry"),
    local,
  })

  await checkAlive({ agent, local })

  return response
}
