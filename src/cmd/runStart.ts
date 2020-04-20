import { runBuild } from "./runBuild"
import { DELAY_AFTER_TRAINING } from "../settings"
import { sleep } from "../helpers"
import { runChat, RunChatOptions } from "./runChat"
import { compileTypescript } from "./compileTypescript"

// Create our agent (or update it, if it already has been created)
export const runStart = async (data: RunChatOptions) => {
  const response = await runBuild({ skipSleepAfterTraining: true })
  console.log("Sleeping for " + DELAY_AFTER_TRAINING / 1000 + " seconds to make sure our agent is ready.")
  await sleep(DELAY_AFTER_TRAINING)
  if (response) {
    await runChat(data)
  } else {
    process.exit()
  }
}
