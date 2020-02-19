import { Agent, build, chat, getStartTurnIndex } from "../"
import { deploy } from "../api/deploy"
const fs = require("fs")

export const start = async () => {
  // Create our agent (or update it, if it already has been created)
  const response = await runBuild()
  if (response) {
    await runChat()
  } else {
    process.exit()
  }
}

const agent: Agent = require(process.cwd() + "/out/" + process.env.npm_package_config_agent.replace(".ts", ".js"))
  .default

const flags = ["script", "record", "local", "startIndex", "dry"]

export const runChat = async () => {
  console.log("Starting chat [Ctrl/Cmd + C to exit]\n")
  const args = process.argv.slice(2)
  let script: string[]
  let recordFile: string
  let startIndex = 0

  for (const arg of args) {
    if (arg.includes("--script=")) {
      const fileName = arg.replace("--script=", "")
      try {
        script = fs
          .readFileSync(fileName)
          .toString()
          .split("\n")
      } catch (err) {
        if (err) {
          console.log("Could not read script file " + fileName)
          script = []
        }
      }
    } else if (arg.includes("--record=")) {
      recordFile = arg.replace("--record=", "")
      if (fs.existsSync(recordFile)) {
        fs.writeFileSync(recordFile, "")
      }
    } else if (arg.includes("--startIndex=")) {
      const newIndex = getStartTurnIndex(arg.replace("--startIndex=", ""), agent.narrative.length)
      startIndex = newIndex ? newIndex : startIndex
    }
  }

  if (!script) {
    script = args.filter(
      arg => {
        for (const flag of flags) {
          if (arg.includes(`--${flag}`)) {
            return false
          }
        }
        return true
      }
    )
  }

  // Start a chat with our agent, in command-line
  chat({ agent, local: args.includes("--local"), startIndex, script, recordFile })
}

// Update our agent
export const runBuild = async () => {
  console.log("Building agent [Ctrl/Cmd + C to exit]\n")

  return await build({ agent, dry: process.argv.includes("--dry"), local: process.argv.includes("--local") })
}

// Deploy our agent to Google assistant

export const runDeploy = async () => {
  const version = process.env.npm_package_version ? process.env.npm_package_version : "0.1.0"
  console.log(`Deploying agent with version ${version} [Ctrl/Cmd + C to exit]\n`)
  await deploy({ agent, version, local: process.argv.includes("--local") })
}
