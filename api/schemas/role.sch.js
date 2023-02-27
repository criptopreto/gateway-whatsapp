'use strict';
const { checkSchema } = require("express-validator");
const Role = require("../services/role.service");
const ObjectId = require("mongoose").Types.ObjectId;
const validators = {
  create_validator: checkSchema({
    name: {
      in: ["body"],
      errorMessage: "Name is required",
      isString: true,
      isLength: {
        errorMessage: "Name should be at least 3 chars long",
        options: { min: 3 },
      },
      custom: {
        options: async (value, { req, location, path }) => {
          let result = await Role.findOne({ name: value });
          if (result) throw new Error("The role is already registered");
          return value;
        },
      },
    },
  }),
  set_default_validator: checkSchema({
    id: {
      in: ["params"],
      errorMessage: "Wrong ID",
      isString: true,
      custom: {
        options: async (value, { req, location, path }) => {
          let isValid = ObjectId.isValid(value)
            ? String(new ObjectId(value) === value)
              ? true
              : false
            : false;
          if (!isValid) throw new Error("Wrong ID.");
          return value;
        },
      },
    },
  }),
};

module.exports = validators;
