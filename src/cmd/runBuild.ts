import { getNamedIntentsFromFolder } from "../helpers"
import { build } from "../api/build"
import { getAgent } from "./agent"
import { compileTypescript } from "./compileTypescript"

// Update our agent

export const runBuild = async ({ skipSleepAfterTraining = false }: { skipSleepAfterTraining?: boolean } = {}) => {
  console.log("Building agent [Ctrl/Cmd + C to exit]")
  try {
    await compileTypescript()
  } catch (err) {
    console.error(err.message)
    process.exit()
  }

  const intents = getNamedIntentsFromFolder("src")
    
  return await build({
    agent: getAgent(),
    intents,
    skipSleepAfterTraining,
    dry: process.argv.includes("!dry"),
    local: process.argv.includes("!local"),
  })
}
