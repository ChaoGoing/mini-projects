#!/usr/bin/env node

const { program } = require("commander");

program
  .version(require("../package.json").version, "-v, -V", "当前版本")
  .description("手写前端框架")
  .usage("<command> [options]")
  .parse(program.argv);

program
  .command("help")
  .alias("-h")
  .action((name, other) => {
    console.log(`
    支持的命令:
    version, -v,-V 输出当前框架的版本
    help,-h 输出帮助程序`);
  });

program
  .command("dev")
  .description("框架开发命令")
  .action(function () {
    const { dev } = require("../lib/dev");
    dev();
  });

program.parse(process.argv);
