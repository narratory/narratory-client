import { Agent } from "../"

const agentPath = require(process.cwd() + "/package.json").config.agent

export const agent: Agent = require(process.cwd() + "/out/src/" + agentPath.replace(".ts", ".js")).default
