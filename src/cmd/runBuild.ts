import { getNamedIntentsFromFolder } from "../helpers"
import { build } from "../api/build"
import { agent } from "./agent"
import { compileTypescript } from "./compileTypescript"

// Update our agent

export const runBuild = async ({ skipSleepAfterTraining = false }: { skipSleepAfterTraining?: boolean } = {}) => {
  compileTypescript()
  console.log("Building agent [Ctrl/Cmd + C to exit]\n")  
  const intents = await getNamedIntentsFromFolder("src")
  return await build({
    agent,
    intents,
    skipSleepAfterTraining,
    dry: process.argv.includes("!dry"),
    local: process.argv.includes("!local"),
  })
}
