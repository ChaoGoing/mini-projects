#! /usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const ora = require('ora')
const spawn = require('cross-spawn');

const message = 'Loading unicorns'
const spinner = ora(message)
spinner.start()

const dependencies = ['vue', 'vuex', 'vue-router'];
// 执行安装
const child = spawn('npm', ['install', '-D'].concat(dependencies), { 
  stdio: 'inherit' 
});

// 监听执行结果
child.on('close', function(code) {
  // 执行失败
  spinner.stop()
  if(code !== 0) {
    console.log(chalk.red('Error occurred while installing dependencies!'));
    process.exit(1);
  }
  // 执行成功
  else {
    spinner.succeed('Loading success')
    console.log(chalk.cyan('Install finished'))   
  }
  
})

program
.version('0.1.0')
.command('create <name>')
.description('create a new project')
.action(name => {
  console.log('project name is ' + chalk.bold(name))
  console.log("project name is " + chalk.bgRed(name))
  console.log("project name is " + chalk.rgb(4, 156, 219).underline(name));

})

program.parse()