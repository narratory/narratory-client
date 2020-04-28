#!/usr/bin/env node
import { initAgent } from "../cmd/runCreate"
import program from "commander"

export {}

program
  .description("Create a new Narratory agent")
  .arguments("<name> Name of agent. Use quotes if you include spaces in the name")

program.on("--help", function () {
  console.log("")
  console.log("Example:")
  console.log('  narratory create "My new agent"')
  console.log('  narratory create "FlightBooker"')
})

program.parse(process.argv)

if (program.args.length > 1) {
  console.log("If you want spaces in your agent name you have to use quotes, for example 'narratory create \"My flight booker\"'");
  process.exit()
} 

const runAsync = async () => {
  await initAgent({
    rootDir: ".",
    agentName: program.args.length > 0 ? program.args[0] : undefined
  })
  process.exit()
}

runAsync()
