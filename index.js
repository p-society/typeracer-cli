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
    message: 'Please enter your username name',
    validate: function (value) {
      if (!value) {
        return 'Please enter your username'
      }
      return true
    }
  }]

program
  .command('start')
  .alias('s')
  .description('Start typeracer')
  .option('-p, --practice', 'Start practice mode')
  .option('-o, --online', 'Start playing online mode')
  .action((options) => {
    if (options.practice) {
      game()
    } else if (options.online) {
      prompt(questionUsername).then(answers => {
        online(answers)
      })
    }
  })

program.parse(process.argv)
