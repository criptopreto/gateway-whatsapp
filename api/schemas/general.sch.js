'use strict';
const { checkSchema } = require("express-validator");
const ObjectId = require("mongoose").Types.ObjectId;
const validators = {
  id_validator: checkSchema({
    id: {
      errorMessage: "ID is required",
      isString: true,
      isLength: {
        errorMessage: "ID should be at least 10 chars long",
        options: { min: 10 },
      },
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
  id_params_validator: checkSchema({
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
