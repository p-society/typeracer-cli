// Requiring modules
const chalk = require("chalk");
import Table = require("cli-table3");
import socketClient = require("socket.io-client");
import { output } from "../functions";
import { randomNumQuote } from "../functions/randomQuote";
import { Game } from "../game/onlineGame";

/**
 * @exports Client
 * @class
 */
export class Client {
  private static socket: any;
  private static username: any;
  private static para: string;
  private static randomParatemp: any;

  private static beforeGame(chunk, key) {
    if (key.ctrl === true && key.name === "r") {
      process.stdout.write("\u001B[2J\u001B[0;0f");
      // Start the game
      const game: Game = new Game();
      game.game(Client.para, Client.socket, Client.username);
    } else if (key.ctrl && key.name === "c") {
      process.exit();
    } else if (key.ctrl && key.name === "f") {
      // If user accepts the rematch then emitting username
      Client.socket.emit("rematch", { username: Client.username });

      process.stdout.write("\u001B[2J\u001B[0;0f");
      output("Waiting....");
    } else if (key.ctrl && key.name === "y") {
      // Changing paragraph
      const temp = randomNumQuote();

      Client.socket.emit("accepted", { username: Client.username, para: temp });

      const game: Game = new Game();
      game.game(temp, Client.socket, Client.username);
    } else if (key.ctrl && key.name === "g") {
      // Starting game
      const game: Game = new Game();
      game.game(Client.randomParatemp, Client.socket, Client.username);
    }
  }

  constructor() {
    Client.socket = socketClient("https://gaudy-cement.glitch.me/", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 2,
    });
  }

  public online(data) {
    Client.username = data.username;
    const stdin: any = process.stdin;
    const stdout: any = process.stdout;
    /**
     * Connection event
     * @event connect
     */

    Client.socket.on("connect", () => {
      stdout.write("\u001B[2J\u001B[0;0f");
      stdout.write(`${Client.username} your connection is established\n`);
      stdout.write("Waiting for others to join...\n");
    });

    // sending room to join for race

    Client.socket.emit("roomNumber", data.roomNumber);

    // setting paragraph to emit

    Client.socket.on("paragraph", (val) => {
      Client.para = val;

      stdout.write("\u001B[2J\u001B[0;0f");
      stdout.write("All users joined Press Ctrl + r to start the race");
      stdin.setRawMode(true);
      stdin.resume();
      require("readline").emitKeypressEvents(stdin);
      stdin.on("keypress", Client.beforeGame);
    });

    // Sending join message

    Client.socket.on("joinMessage", (val) => {
      output(chalk.green(val.message));
    });

    // Sending leave message

    Client.socket.on("disconnectMessage", (val) => {
      output(chalk.blue("\n" + val));
    });

    // Emitting client info on joining the room

    Client.socket.on("room", (val) => {
      Client.socket.emit("join", { roomName: val.value, username: data.username, number: data.number, randomNumber: data.randomNumber });
    });

    // Sending error message to client
    Client.socket.on("err", (val) => {
      output(chalk.red(val.message));
      process.exit();
    });

    // Getting event when game ends

    Client.socket.on("score", (val) => {
      stdout.write("\u001B[2J\u001B[0;0f");
      val.forEach((result) => {
        output(chalk.cyan(`\n${result.username} completed with speed of ${result.score}`));
      });
      output(chalk.green("\nYou are smart enough to guess the winner.\n\n"));
      output(chalk.cyan("Press Ctrl + f to request a rematch\nPress Ctrl + c to quit"));

      // Showing message to request rematch

      Client.socket.on("requestRematch", (val) => {
        process.stdout.write("\u001B[2J\u001B[0;0f");
        output(val.message);
        output(chalk.green("Press Ctrl + y to accept"));
        output(chalk.red("Ctrl + c to quit"));
      });

      // Showing accepted request

      Client.socket.on("requestRematchaccepted", function(val) {
        process.stdout.write("\u001B[2J\u001B[0;0f");
        output(val.message);
        Client.randomParatemp = val.para;
      });
    });
  }

  public score() {
    Client.socket.on("connect", function() {
      process.stdout.write("\u001B[2J\u001B[0;0f");
    });

    Client.socket.on("highscores", (val) => {
      const table: any = new Table({
        head: ["Player", "Highscore"],
        colWidths: [30, 20],
      });

      val.forEach((result) => {
        const final = [`${result.username}`, `${result.score}`];
        table.push(final);
      });
      output(table.toString());
      process.exit();
    });
  }
}
