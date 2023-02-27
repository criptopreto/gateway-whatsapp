const { ValidationError } = require("../helpers/errors");

module.exports = function (err, req, res, next) {
  if (err.isBoom) {
    if (err instanceof ValidationError) {
      return res.status(err.output.statusCode).json({
        ...err.output.payload,
        message: err.errors,
        type: "Validation Error",
      });
    } else {
      return res.status(err.output.statusCode).json(err.output.payload);
    }
  }
};
