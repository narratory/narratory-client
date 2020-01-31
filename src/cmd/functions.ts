import { Agent, create, chat, getStartTurnIndex } from "../"

export const start = async () => {
  // Create our agent (or update it, if it already has been created)
  await build()
  await runChat()
}

export const runChat = async () => {
  console.log("Starting chat [Ctrl/Cmd + C to exit]\n")

  // Start a chat with our agent, in command-line
  const agent: Agent = require(process.cwd() + "/out/" + process.env.npm_package_config_agent.replace(".ts", ".js"))
    .default

  chat({ agent, startingTurn: getStartTurnIndex(process.argv, agent) })
}

// Update our agent
export const build = async () => {
  console.log("Building agent [Ctrl/Cmd + C to exit]\n")

  const agent: Agent = require(process.cwd() + "/out/" + process.env.npm_package_config_agent.replace(".ts", ".js"))
    .default

  await create({ agent, local: process.argv.includes("--local") })
}
