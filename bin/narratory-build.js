#!/usr/bin/env node

var { runBuild } = require("../out/cmd/runBuild")
var program = require("commander")

program.description("Build your Narratory agent.")

program.on("--help", function () {
  console.log("")
  console.log("Example:")
  console.log("  narratory build")
})

program.parse(process.argv)

const runAsync = async () => {
  await runBuild()
  process.exit()
}

runAsync()
