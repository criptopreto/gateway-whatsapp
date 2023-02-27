"use strict";
const mongoose = require("mongoose");
const { generateOtp } = require("../helpers/auxfunctions");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const phoneSchema = new Schema({
  phone: { type: String, required: true, unique: true },
  phone_otp: { type: String },
  phone_validated: { type: Boolean, default: false },
  activated_at: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date },
  _user: { type: ObjectId, ref: "user" },
});

phoneSchema.pre("save", function (next) {
  this.phone_otp = generateOtp();

  next();
});

module.exports = mongoose.model("phone", phoneSchema);
