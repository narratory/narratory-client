#!/usr/bin/env node

var { runStart } = require("../out/cmd/runStart");
var program = require('commander');

program
    .description('Build and then run with your Narratory agent.')
    .arguments('[chat inputs]')
    .option("-r, --record <fileName>", "Record dialog to file")
    .option("-p, --play <fileName>", "Replay dialog from file")
    .option("-d, --debug", "Include debugging information")
  
  program.on("--help", function () {
    console.log("\nExamples:")
    console.log("  narratory start                     Build agent and then start chat")
    console.log("  narratory start -r test.txt         Build agent and then start chat and record the session to test.txt")
    console.log("  narratory start -p test.txt         Build agent and then start chat replaying the session from test.txt")
  })
  
  program.parse(process.argv)
  
  const runAsync = async () => {
    await runStart({
      recordToFile: program.record,
      replayFromFile: program.play,
      script: program.args,
      debug: program.debug
    })
  }

runAsync()