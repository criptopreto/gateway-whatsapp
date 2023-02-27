"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const socketSchema = new Schema({
  session_id: { type: String, required: true, unique: true },
  connected: { type: Boolean },
  user: { type: mongoose.Types.ObjectId, ref: "user" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date },
});

module.exports = mongoose.model("socket", socketSchema);
