import * as fs from "fs"
import { getStartTurnIndex } from "../helpers"
import { getAgent } from "./agent"
import { chat } from "../api/chat"

export interface RunChatOptions {
  recordToFile?: string
  replayFromFile?: string
  startIndex?: string
  script?: string[]
  debug: boolean
  local: boolean
}

export const runChat = async (data: RunChatOptions) => {
  console.log("Starting chat [Ctrl/Cmd + C to exit]\n")

  let _script: string[]

  if (data.replayFromFile) {
    try {
      _script = data.replayFromFile ? fs.readFileSync(data.replayFromFile).toString().split("\n") : []
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

  const _startIndex = data.startIndex ? getStartTurnIndex(data.startIndex, getAgent().narrative.length) : 0

  chat({
    agent: getAgent(),
    local: process.argv.includes("!local"),
    startIndex: _startIndex,
    script: _script,
    debug: data.debug,
    recordFile: data.recordToFile,
  })
}
