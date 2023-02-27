"use strict";

const { HTTP_INTERNAL_SERVER_ERROR } = require("./constants/httpStatusCodes");
const { logger } = require("./logger");
const Boom = require("boom");

class CredentialsError extends Error {
  constructor(message, code = 401, send_message = false) {
    super(message);

    this.name = this.constructor.name;
    this.code = code;
    this.send_message = send_message;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends Error {
  constructor(errors) {
    super(errors);

    this.name = this.constructor.name;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

class HTTPError extends Error {
  constructor(message, boom, send_message = false) {
    super(message);

    this.name = this.constructor.name;
    this.boom = boom;
    this.send_message = send_message;

    Error.captureStackTrace(this, this.constructor);
  }
}
const handleHTTPError = (err, next) => {
  logger.error(err);

  if (err.isBoom) return next(err);
  return next(Boom.boomify(err, { statusCode: HTTP_INTERNAL_SERVER_ERROR }));
};

module.exports = {
  CredentialsError,
  ValidationError,
  HTTPError,
  handleHTTPError,
};
