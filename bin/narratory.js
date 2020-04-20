#!/usr/bin/env node
var program = require("commander")

program
  .version("0.1.0")
  .description("Narratory client")
  .command("start", "build and then start a chat with your agent")
  .command("build", "build your agent")
  .command("chat", "chat with your agent")
  .command("validate", "validate the Intents and Entities of your built agent")
  .command("deploy", "deploy your agent")
  .parse(process.argv)