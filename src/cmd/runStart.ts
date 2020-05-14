import { runBuild } from "./runBuild"
import { DELAY_AFTER_TRAINING } from "../settings"
import { sleep } from "../helpers"
import { runChat, RunChatOptions } from "./runChat"

// Create our agent (or update it, if it already has been created)
export const runStart = async (data: RunChatOptions) => {
  const response = await runBuild({ skipSleepAfterTraining: true })
  if (response) {
    await runChat(data)
  } else {
    process.exit()
  }
}
