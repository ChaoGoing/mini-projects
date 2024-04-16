#! /usr/bin/env node

const program = require("commander");
const chalk = require("chalk");
const figlet = require("figlet");

program
  .command("create <name>")
  .description("create a new project")
  .action((name, options) => {
    console.log("name, options: ", name, options);
    require("../lib/create.js")(name, options);
  })
  .option("-t --template<template>", "repo template")
  .option("-f --force", "overwrite target directory if it exist");
// .parse(process.argv) 不能链式调用？

program
  .command("config [value]")
  .description("inspect and modify the config")
  .option("-g, --get <path>", "get value from option")
  .option("-s, --set <path> <value>")
  .option("-d, --delete <path>", "delete option from config")
  .action((value, options) => {
    console.log(value, options);
  });

program.on("--help", () => {
  console.log(
    "\r\n" +
      figlet.textSync("achaoGoing", {
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 120,
        whitespaceBreak: true,
      })
  );

  console.log(
    `\r\nRun ${chalk.cyan(
      `zr <command> --help`
    )} for detailed usage of given command\r\n`
  );
});

program
  // 配置版本号信息
  .version(`v${require("../package.json").version}`)
  .usage("<command> [option]");

program.parse(process.argv);
