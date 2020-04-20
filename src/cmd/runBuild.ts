import { getNamedIntentsFromFolder } from "../helpers"
import { build } from "../api/build"
import { getAgent } from "./agent"
import { compileTypescript } from "./compileTypescript"

// Update our agent

export const runBuild = async ({ skipSleepAfterTraining = false }: { skipSleepAfterTraining?: boolean } = {}) => {
  console.log("Building agent [Ctrl/Cmd + C to exit]\n")  
  compileTypescript()
  const intents = await getNamedIntentsFromFolder("src")
  return await build({
    agent: getAgent(),
    intents,
    skipSleepAfterTraining,
    dry: process.argv.includes("!dry"),
    local: process.argv.includes("!local"),
  })
}
