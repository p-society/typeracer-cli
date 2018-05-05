#!/usr/bin/env node

/**
* Module dependencies and files from other folders
*/

const program = require('commander')
const game = require('./scripts/game')
const online = require('./online/client')

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
      online()
    }
  })

program.parse(process.argv)
