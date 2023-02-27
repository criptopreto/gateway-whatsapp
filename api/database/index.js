"use strict";
const mongoose = require("mongoose");
async function connect() {
  return new Promise((res, rej) => {
    try {
      mongoose.set("strictQuery", false);
      mongoose.connect(process.env.DB_URI);
      res("DB Connected");
    } catch (error) {
      rej(error);
    }
  });
}

module.exports = { connect };
