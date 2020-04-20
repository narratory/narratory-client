#!/usr/bin/env node

var { runValidate } = require("../out/cmd/runValidate");
var program = require('commander');

program
    .description("Validate your Narratory agent's NLU model")

program.on('--help', function(){
    console.log('')
    console.log('Example:');
    console.log('  narratory validate');
});

program.parse(process.argv);

const runAsync = async () => {
    await runValidate()
    process.exit()
}

runAsync()