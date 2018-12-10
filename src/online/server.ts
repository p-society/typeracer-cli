"use strict";
require("dotenv").config();
/*
  Import modules
*/

import express = require("express");
import mongoose = require("mongoose");
import { output } from "../functions";
import { randomNumQuote } from "../functions/randomQuote";
const Score = require("./scoreSchema");
const chalk = require("chalk");
let arr: any = [];
/**
 * @exports Typeracer
 * @class
 */
export class Typeracer {
  private static io: any;
  private static arr: any;
  private port: any;
  private server: any;
  private app: any;
  constructor() {
    this.port = process.env.PORT || 3000;
    this.app = express();
    this.server = require("http").createServer(this.app);
    Typeracer.io = require("socket.io")(this.server);

    // MongoDb connecting
    mongoose.connect(process.env.DATABASE, { useNewUrlParser: true }).then(() => {
      output("Mongo Connected!");
    }).catch((err) => {
      output("Cannot connect to database because " + err);
    });

    this.server.listen(this.port);

    // When new connection takes place
    Typeracer.io.on("connection", function(client) {
      output("connection");
      Score.findOne({ _id: process.env.ID }, (err, players) => {
        if (err) {
          output(chalk.red("Sorry encountered some error please try in some time"));
        } else {
          const playersArray = players.players.sort(function(a, b) {
            return b.score - a.score;
          });
          client.emit("highscores", playersArray);
        }
      });

      const room = function(value) {
        client.join(value);

        client.emit("room", { value });
      };

      /** Getting info when client joins
       * @event join
       * @function
       * @param {Object} val
       */

      client.on("join", function(val) {
        const countUser = Typeracer.io.sockets.adapter.rooms[val.roomName].length;

        // Sending join message to everyone in room except client who joins

        client.to(val.roomName).emit("joinMessage", { message: `${val.username} joined` });

        // Sending message to everyone if client leaves the room

        client.on("disconnect", () => {
          arr = [];
          client.to(val.roomName).emit("disconnectMessage", `${val.username} left`);
        });

        // Sending score to everyone when game ends
        client.on("end", function(result) {
          arr.push(result);
          const score = result.score;
          const username = result.username;

          // Getting documents from databse

          Score.findOne({ _id: process.env.ID }, (err, players) => {
            if (err) { throw new Error(err); }
            const playersArray: any = players.players.sort(function(a, b) {
              return b.score - a.score;
            });
            const lowestScore: any = [];
            lowestScore.push(playersArray[playersArray.length - 1].score);

            // checking if last score is less then current score
            function remove() {
              // First removing last player
              Score.update({ _id: process.env.ID }, { $pop: { players: 1 } }, (err) => {
                if (err) { throw new Error(err); }
                output("Removed last player");
              });
            }

            function add() {
              // Then updating current player
              Score.update({ _id: process.env.ID }, { $push: { players: { score, username } } }, (err) => {
                if (err) { throw new Error(err); }
                output("Added new High score");
              });
            }

            async function update() {
              // Then again sorting it correctly
              await Score.update({ _id: process.env.ID }, { $push: { players: { $each: [], $sort: -1 } } }, (err) => {
                if (err) { throw new Error(err); }
                output("Sorted in descending order after adding");
              });
            }
            if (score > lowestScore[0]) {
              (async () => {
                Promise.all([update()]).then(async () => {
                  await remove();
                  await add();
                  await update();
                });
              })();
            }
          });

          // Fetching top scores to database

          if (arr.length === Typeracer.io.sockets.adapter.rooms[val.roomName].length) {
            Typeracer.io.in(val.roomName).emit("score", arr);
            arr = [];
          }
          // Getting event for rematch
          client.on("rematch", function(result) {
            arr = [];
            client.to(val.roomName).emit("requestRematch", { message: `${result.username} requested a rematch` });
          });

          // Getting accepted requests form clients
          client.on("accepted", function(result) {
            client.to(val.roomName).emit("requestRematchaccepted", { message: `${result.username} accepted rematch press Ctrl + g`, para: result.para });
          });
        });

        if (val.number && (Number(val.number) === countUser)) {
          Typeracer.io.in(val.roomName).emit("paragraph", randomNumQuote());
        } else if (countUser > Number(val.number)) {
          client.emit("err", { message: `Sorry ${val.number} users are already playing the game` });
          client.disconnect(true);
        }
      });

      client.on("roomNumber", room);
    });
  }
}
