#!/usr/bin/env node

export {}

import { runBuild } from "../cmd/runBuild"
import program from "commander"

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
