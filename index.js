#!/usr/bin/env node

/**
* Module dependencies and files from other folders
*/

const program = require('commander')
const game = require('./scripts/game')
const online = require('./online/client')
const {prompt} = require('inquirer')

/**
 * setting questions for online mode
*/

const questionUsername = [
  {
    type: 'input',
    name: 'username',
    message: 'Enter Username',
    validate: function (value) {
      if (!value) {
        return 'Please enter Username'
      }
      return true
    }
  }]

program
  .command('practice')
  .alias('p')
  .description('Start typeracer')
  .action(() => {
      game()
  })

program
  .command('online')
  .alias('o')
  .description('Start game in online mode')
  .option('-f, --friendly', 'Start playing online mode among 5 friends')
  .action((options)=>{
    if (options.friendly) {
      prompt(questionUsername).then(answers => {
        online(answers)
      })
    }
  })

program.parse(process.argv)
