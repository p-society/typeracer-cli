#!/usr/bin/env node

"use strict";
/*
  Import modules
*/

import program = require("commander");
import crypto = require("crypto");
import figlet = require("figlet");
import { prompt } from "inquirer";
import {output} from "./functions";
import { randomNumQuote } from "./functions/randomQuote";
import { Game } from "./game/offlineGame";
import {offline} from "./questions";
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

program.parse(process.argv);

if (program.args.length === 0) { program.help(); }
