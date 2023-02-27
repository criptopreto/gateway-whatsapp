"use strict";
const mongoose = require("mongoose");
const backref = require("mongoose-backref");
async function connect() {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.DB_URI);
    mongoose.plugin(backref);
    console.log("DB Connected");
  } catch (error) {
    console.log("error");
    console.log(error);
    process.exit(1);
  }
}

module.exports = { connect };
