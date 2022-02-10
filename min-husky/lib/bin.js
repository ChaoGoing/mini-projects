#!/usr/bin/env node

const { install } = require('./funcs')
const [func, ...args] = process.argv.slice(2)

const cmds = {
    install
}

let cmd
try{
    if(cmd = cmds[func]) {
        cmd(...args)
    }
}catch(e) {
    console.log(e)
    process.exit(1)
}