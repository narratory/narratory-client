import { Agent } from "../"
import * as fs from "fs"
import { compileTypescript } from "./compileTypescript"

let agent: Agent

export const getAgent = (): Agent => {
  if (agent) {
    return agent
  } else {
    let agentName: String
    try {
      agentName = require(process.cwd() + "/package.json").config.agent
      if (!agentName || agentName.length === 0 || !agentName.endsWith("ts")) {
        throw Error(
          "No (or invalid) agent file name set. Please make sure you have the name of the file default-exporting your agent in package.json's config object."
        )
      }
    } catch (err) {
      throw err
    }

    const agentPath =
      process.cwd() + "/out/src/" + agentName.replace(".ts", ".js")

    if (fs.existsSync(agentPath)) {
      return require(agentPath).default
    } else {
      compileTypescript()
      if (fs.existsSync(agentPath)) {
        return require(agentPath).default
      } else {
        throw Error(
          `Can't find ${agentName}. Please make sure you have the name of the file default-exporting your agent in package.json's config object.`
        )
      }
    }
  }
}
