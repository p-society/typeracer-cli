#!/usr/bin/env node

/**
* Module dependencies and files from other folders
*/

const program = require('commander')
const game = require('./scripts/game')

program
  .command('start')
  .alias('s')
  .description('Start typeracer')
  .option('-p, --practice', 'Start practice mode')
  .option('-o, --online', 'Start playing online mode')
  .action((options) => {
    if (options.practice) {
      game()
    }
  })

program.parse(process.argv)
