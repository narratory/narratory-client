import { Agent, create, chat, getStartTurnIndex } from "../"
import { deploy } from "../api/deploy"

export const start = async () => {
  // Create our agent (or update it, if it already has been created)
  await build()
  await runChat()
}

const agent : Agent = require(process.cwd() + "/out/" + process.env.npm_package_config_agent.replace(".ts", ".js")).default

export const runChat = async () => {
  console.log("Starting chat [Ctrl/Cmd + C to exit]\n")
  const args = process.argv.slice(2)
  let script : string[]
  let recordFile : string

  for (const arg of args) {
    if (arg.includes("--script=")) {
      const fileName = arg.replace("--script=", "")
      var fs = require('fs');
      try {
        script = fs.readFileSync(fileName).toString().split("\n")
      } catch(err) {
        if (err) {
          console.log("Could not read script file " + fileName)
          script = []
        }
      }
    } else if (arg.includes("--record")) {
      recordFile = arg.replace("--record=", "")
      if (fs.existsSync(recordFile)) {
        console.log("Overwriting old file " + recordFile)
        fs.writeFileSync(recordFile, "")
      }
    }
  }

  if (!script) {
    script = args.filter(arg => !arg.includes("--script") && !arg.includes("--record"))
  }

  // Start a chat with our agent, in command-line
  chat({ agent, startingTurn: getStartTurnIndex(process.argv, agent), script, recordFile })
}

// Update our agent
export const build = async () => {
  console.log("Building agent [Ctrl/Cmd + C to exit]\n")

  await create({ agent, local: process.argv.includes("--local") })
}

// Deploy our agent to Google assistant

export const runDeploy = async () => {
  const version = process.env.npm_package_version ? process.env.npm_package_version : "0.1.0"
  console.log(`Deploying agent with version ${version} [Ctrl/Cmd + C to exit]\n`)
  await deploy({ agent, version, local: process.argv.includes("--local") })
}