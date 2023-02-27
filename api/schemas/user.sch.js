"use strict";
const { checkSchema } = require("express-validator");
const emailService = require("../services/email.service");
const phoneService = require("../services/phone.service");
const User = require("../services/user.service");
const validators = {
  signup_validator: checkSchema({
    password: {
      in: ["body"],
      errorMessage: "Passsword is required",
      isString: true,
      isLength: {
        errorMessage: "Password should be at least 6 chars long",
        options: { min: 6 },
      },
    },
    email: {
      isEmail: {
        bail: true,
      },
      custom: {
        options: async (value, { req, location, path }) => {
          let result = await emailService.findByEmail(value);
          if (result) throw new Error("The mail is already registered");
          return value;
        },
      },
    },
    phone: {
      in: ["body"],
      isNumeric: true,
      custom: {
        options: async (value, { req, location, path }) => {
          let result = await phoneService.findOne({ phone: value });
          if (result) throw new Error("The phone number is already registered");
          return value;
        },
      },
    },
    repeatPassword: {
      in: ["body"],
      errorMessage: "Repeat passsword is required",
      isString: true,
      isLength: {
        errorMessage: "Password should be at least 6 chars long",
        options: { min: 6 },
      },
      custom: {
        options: (value, { req, location, path }) => {
          if (value !== req.body.password)
            throw new Error("Password must be same");
          return value;
        },
      },
    },
  }),
  signin_validator: checkSchema({
    username: {
      in: ["body"],
      errorMessage: "Email is required",
      isString: true,
    },
    password: {
      in: ["body"],
      errorMessage: "Passsword is required",
      isString: true,
    },
  }),
};

module.exports = validators;
