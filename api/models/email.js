"use strict";
const mongoose = require("mongoose");
const { generateOtp } = require("../helpers/auxfunctions");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const emailSchema = new Schema({
  email: { type: String, required: true, unique: true },
  email_otp: { type: String },
  email_validated: { type: Boolean, default: false },
  activated_at: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date },
  _user: { type: ObjectId, ref: "user" },
});

emailSchema.pre("save", function (next) {
  this.email_otp = generateOtp();
  next();
});

module.exports = mongoose.model("email", emailSchema);
