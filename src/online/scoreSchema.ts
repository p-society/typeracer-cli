import mongoose = require("mongoose");
import { Schema } from "mongoose";

const scoreSchema = new Schema({
  players: {
    type: Array,
  },
});

module.exports = mongoose.model("Score", scoreSchema);
