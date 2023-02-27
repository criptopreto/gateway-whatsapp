const Boom = require("boom");
const { logger } = require("../helpers/logger");

module.exports = function (err, req, res, next) {
  logger.error(err);
  if (err.isBoom) {
    return next(err);
  } else {
    return next(Boom.boomify(err, { statusCode: 500 }));
  }
};
