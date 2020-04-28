import * as fs from "fs"
import { getStartTurnIndex } from "../helpers"
import { getAgent } from "./agent"
import { chat } from "../api/chat"
import { validateAgentCredentialsFormat } from "./helpers"

export interface RunChatOptions {
  recordToFile?: string
  replayFromFile?: string
  startIndex?: string
  script?: string[]
  debug: boolean
}

export const runChat = async (data: RunChatOptions) => {
  console.log("Starting chat [Ctrl/Cmd + C to exit]\n")

  const agent = getAgent()

  validateAgentCredentialsFormat(agent)

  const _startIndex = data.startIndex
    ? getStartTurnIndex(data.startIndex, agent.narrative.length)
    : 0

  let _script: string[]

  if (data.replayFromFile) {
    try {
      _script = data.replayFromFile
        ? fs.readFileSync(data.replayFromFile).toString().split("\n")
        : []
    } catch (err) {
      if (err) {
        console.log("Could not read script file " + data.replayFromFile)
        _script = []
      }
    }
  }

  if (!_script && data.script) {
    _script = data.script.filter((str) => !["!dry", "!local"].includes(str))
  }

  if (data.recordToFile) {
    if (fs.existsSync(data.recordToFile)) {
      fs.writeFileSync(data.recordToFile, "")
    }
  }

  try {
    chat({
      agent,
      local: process.argv.includes("!local"),
      startIndex: _startIndex,
      script: _script,
      debug: data.debug,
      recordFile: data.recordToFile,
    })
  } catch (err) {
    console.log("An error happened in chat. Error: ", err.message)
    process.exit()
  }
}
