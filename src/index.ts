#!/usr/bin/env node

"use strict";
/*
  Import modules
*/

import program = require("commander");
import crypto = require("crypto");
import figlet = require("figlet");
import { prompt } from "inquirer";
import { output } from "./functions";
import { randomNumQuote } from "./functions/randomQuote";
import { Game } from "./game/offlineGame";
import { Client } from "./online/client";
import { online } from "./questions";
const chalk = require("chalk");

// Clearing the terminal
output("\u001B[2J\u001B[0;0f");

output(
  chalk.red(
    figlet.textSync("typeracer-cli", { horizontalLayout: "full" }),
  ),
);

program
  .command("practice")
  .alias("p")
  .description("Starts typeracer in practice mode")
  .action(() => {
    const game: Game = new Game(randomNumQuote());
    game.game();
  });

program
  .command("online")
  .alias("o")
  .description("Start game in online mode")
  .option("-f, --friendly", "Start playing online mode among friends (max 5)")
  .option("-s, --highscore", "See top 10 high scores")
  .action((options) => {
    if (options.friendly) {
      prompt(online.question1).then((answers) => {
        if (answers.join === true) {
          // Generating random channel
          const roomNumber = crypto
            .randomBytes(12)
            .toString("base64")
            .replace(/[+/=]+/g, "");

          output(chalk.cyan(`Your room number is: ${roomNumber} . Give your friends this number to join.`));
          prompt(online.question2).then((answers) => {
            output("Connecting.....");
            const game: Client = new Client();
            game.online(answers);
          });
        } else {
          prompt(online.question3).then((answers) => {
            output(chalk.green("Connecting....."));
            const game: Client = new Client();
            game.online(answers);
          });
        }
      });
    } else if (options.highscore) {
      output(chalk.green("Fetching Highscores..."));
      const game: Client = new Client();
      game.score();
    }
  });

program.parse(process.argv);

if (program.args.length === 0) { program.help(); }
