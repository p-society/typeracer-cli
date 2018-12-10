/**
 * Module dependencies and files from other folders
 */
const chalk = require("chalk");
import { prompt } from "inquirer";
import logUpdate = require("log-update");
import { output } from "../functions";
import { randomNumQuote } from "../functions/randomQuote";
import { offline } from "../questions";

/**
 * @exports Game
 * @class
 */

export class Game {
  private static stdin: any;
  private static stdout: any;
  private static time: number;
  private static wordsPermin: number;
  private static gameEnd: boolean;
  private static timeStarted: number;
  private static quote: string;
  private static stringTyped: string;

  /**
   * @method keypress private
   * @static
   * @param chunk
   * @param key
   */
  private static keypress(chunk, key) {
    if (key.ctrl && key.name === "c") {
      Game.stdout.write("\n");
      process.exit();
    }
    if (key && key.name === "backspace") {
      if (Game.stringTyped.length === 0) { return; }
      Game.stringTyped = Game.stringTyped.slice(0, -1);
    } else if (Game.stringTyped.length < Game.quote.length) {
      Game.stringTyped += chunk;
    }
    Game.updateColor();
  }

  /**
   * @method updateColor
   * @static
   */
  private static updateColor() {
     // Clearing the terminal for double time error
    output("\u001B[2J\u001B[0;0f");

    let updatedString = Game.color(Game.quote, Game.stringTyped);
    updatedString += Game.quote.slice(Game.stringTyped.length, Game.quote.length);
    const timeColour = "cyan";
    let wordsPerminColor = "cyan";
    if (Game.wordsPermin < 30) {
      wordsPerminColor = "red";
    }
    logUpdate(
      `${updatedString}
    wordsPermin: ${chalk[wordsPerminColor](Math.round(Game.wordsPermin * 10) / 10)}
    time: ${chalk[timeColour](Math.round(Game.time * 10) / 10)}s`);
  }

  /**
   * @method color private
   * @static
   * @param quote
   * @param stringTyped
   */
  private static color(quote, stringTyped) {
    let colouredString = "";
    let wrongInput = false;

    const quoteLetters = quote.split("");
    const typedLetters = stringTyped.split("");
    for (let i = 0; i < typedLetters.length; i++) {
      // if a single mistake,
      // the rest of the coloured string will appear red
      if (wrongInput) {
        colouredString += chalk.bgRed(quoteLetters[i]);
        continue;
      }

      if (typedLetters[i] === quoteLetters[i]) {
        wrongInput = false;
        colouredString += chalk.green(quoteLetters[i]);
        if (quote === stringTyped) {
          this.gameEnd = true;
        }
      } else {
        wrongInput = true;
        colouredString += chalk.bgRed(quoteLetters[i]);
      }
    }
    return colouredString;
  }
  /**
   * @method Time private
   * @static
   */
  private static Time() {
    Game.time = (Date.now() - Game.timeStarted) / 1000;
  }

  /**
   * This counts words per minute typed by user
   * @method updateWpm private
   */
  private static updateWpm() {
    if (Game.stringTyped.length > 0) {
      Game.wordsPermin = Game.stringTyped.split(" ").length / (Game.time / 60);
    }
  }

  /**
   * @method gameEnded private
   * @static
   */
  private static gameEnded() {
    Game.stdin.removeListener("keypress", Game.keypress);
    prompt(offline.question1).then((answers) => {
      switch (answers.whatdo) {
        case "Retry":
          const game: Game = new Game(randomNumQuote());
          game.game();
          break;
        case "Exit":
          process.exit();
        default:
          process.exit();
      }
    });
  }

  /**
   * @constructor
   */
  constructor(randQuote: string) {
    Game.gameEnd = true;
    Game.timeStarted = 0;
    Game.time = 0;
    Game.wordsPermin = 0;
    Game.quote = randQuote;
    // Creating an interface for reading line from console
    Game.stdin = process.stdin;
    Game.stdout = process.stdout;
    Game.stdin.setRawMode(true);
    Game.stdin.resume();
    require("readline").emitKeypressEvents(Game.stdin);
  }

  /**
   * @method game public
   */
  public game() {
    output("\u001B[2J\u001B[0;0f");
    Game.gameEnd = false;
    Game.stringTyped = "";
    Game.timeStarted = Date.now() + 1000;
    Game.wordsPermin = 0;
    const startColor = "yellowBright";
    // Game Start
    const startinterval = setInterval(() => {
      const timeInterval = (Math.round((Date.now() - Game.timeStarted) / 1000 * 10) / 10);
      logUpdate(`\nGame Starting in ${chalk[startColor](timeInterval)} sec`);
      if (timeInterval === 0) {
        clearInterval(startinterval);
        // displaying the quote after clearing the terminal
        output("\u001B[2J\u001B[0;0f");
        Game.stdout.write(Game.quote);
        // Moving cursor to start
        Game.stdout.cursorTo(0);
        Game.stdin.on("keypress", Game.keypress);
        Game.stdin.setRawMode(true);
        Game.stdin.resume();
      }
    }, 1000);

    // After game starts

    const interval = setInterval(() => {
      if (Game.gameEnd) {
        Game.gameEnded();
        clearInterval(interval);
      } else {
        Game.Time();
        Game.updateWpm();
      }
    }, 1000);
  }
 }
