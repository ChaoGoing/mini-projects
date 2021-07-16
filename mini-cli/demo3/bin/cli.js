#! /usr/bin/env node

const program = require('commander')

program
.command('create <name>')
.description('create a new project')
.action((name, options) => {
  require('../lib/create.js')(name, options)
})
.option('-t --template<template>', 'repo template')
.option('-f --force', 'overwrite target directory if it exist')
// .parse(process.argv) 不能链式调用？

program.on('--help', () => {
  console.log(`\r\nRun ${chalk.cyan(`zr <command> --help`)} for detailed usage of given command\r\n`)
})

program.parse(process.argv)