#!/usr/bin/env node

/**
* Module dependencies and files from other folders
*/

const program = require('commander')
const game = require('./scripts/game')

/**
* @event {String} keypress
* Listening to keypess and storing in array to compare with the word
*/

program
  .command('start')
  .alias('s')
  .description('Start typeracer')
  .option('-p, --practice', 'Start practice mode')
  .option('-o, --online', 'Start playing online mode')
  .action((options) => {
    if(options.practice) {
      game()
    }
  })

program.parse(process.argv)
