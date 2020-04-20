#!/usr/bin/env node

var { runDeploy } = require("../out/cmd/runDeploy")
var program = require("commander")

program.description("Deploys your Narratory agent with the given version").arguments("<version>")

program.on("--help", function () {
  console.log("")
  console.log("Example:")
  console.log("  narratory deploy 1.0.2         Deploys the currently built agent with version 1.0.2")
})

program.parse(process.argv)

if (program.args.length === 0) {
  console.log(`You have to supply a version number, for example "narratory deploy 1.0.2"`)
  process.exit()
}
const runAsync = async () => {
  await runDeploy({
    version: program.args[0],
  })
  process.exit()
}

runAsync()
