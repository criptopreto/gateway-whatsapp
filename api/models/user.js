"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
  username: { type: String, unique: true },
  email: { type: ObjectId, ref: "email", unique: true },
  phone: { type: ObjectId, ref: "phone", unique: true },
  role: { type: ObjectId, ref: "role", required: true },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  activated: { type: Boolean, default: false },
  activated_by: {
    type: String,
    enum: ["phone", "email"],
  },
  enrolled: { type: Boolean, default: false },
  last_login: { type: Date },
  last_password_changed: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userSchema);
