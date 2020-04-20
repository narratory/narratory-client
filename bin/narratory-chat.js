#!/usr/bin/env node

var { runChat } = require("../out/cmd/runChat")
var program = require("commander")

program
  .description("Chat with your Narratory agent.")
  .arguments("[inputs]")
  .option("-r, --record <fileName>", "Record dialog to file")
  .option("-p, --play <fileName>", "Replay dialog from file")

program.on("--help", function () {
  console.log("\nExamples:")
  console.log("  narratory chat                     Start chat")
  console.log("  narratory chat -r test.txt         Start chat and record the session to test.txt")
  console.log("  narratory chat -p test.txt         Start chat replaying the session from test.txt")
})

program.parse(process.argv)

const runAsync = async () => {
  await runChat({
    recordToFile: program.record,
    replayFromFile: program.play,
    script: program.args,
  })
}

runAsync()
