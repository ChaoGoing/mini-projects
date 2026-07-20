#! /usr/bin/env node

const yargs = require("yargs");
const { runInitPrompts } = require("../src/run-prompts");

yargs
  .usage("usage: jslibbook [options]")
  .usage("usage: jslibbookk <command> [options]")
  .alias("v", "version")
  .command(["new", "n"], "新建一个项目", async function (argv) {
    console.log("argv: ", argv);
    const answer = await runInitPrompts(argv.pathname || "example", argv);
    console.log("answer: ", answer);
  })
  .demandCommand().argv;
