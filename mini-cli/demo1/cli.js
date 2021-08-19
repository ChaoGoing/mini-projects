#! /usr/bin/env node

const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')

inquirer.prompt([
  {
    type: 'input',
    name: 'name',
    message: 'your name',
    default: 'custom-cli'
  }
]).then(answers => {
  console.log(answers)
  const destUrl = path.join(__dirname, 'templates')
  // process.cwd() 控制台所在目录
  const cwdUrl = process.cwd()
  fs.readdir(destUrl, (err, files) => {
    if(err) throw err
    files.forEach(file => {
      ejs.renderFile(path.join(destUrl, file), answers).then(data => {
        fs.writeFileSync(path.join(cwdUrl, file), data)
      })
    })
  })
})

