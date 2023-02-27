"use strict";
const Boom = require("boom");
const { validationResult } = require("express-validator");
const { HTTP_BAD_REQUEST } = require("../helpers/constants/httpStatusCodes");
const { ValidationError } = require("../helpers/errors");

const validate_request = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw Boom.boomify(
        new ValidationError(errors.array().map(({ msg }) => msg)),
        {
          statusCode: HTTP_BAD_REQUEST,
        }
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = validate_request;
