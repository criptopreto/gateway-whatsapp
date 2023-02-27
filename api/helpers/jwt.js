"use strict";

const Boom = require("boom");
const jwt = require("jsonwebtoken");

function createToken(id, duration = "1d") {
  const payload = {
    sub: id,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: duration,
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  });
}

function verifyToken(token) {
  try {
    if (!process.env.JWT_SECRET)
      throw Boom.internal("JWT secret is not present");
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    return payload.sub;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw Boom.unauthorized("Token expired");
    } else if (error.name === "JsonWebTokenError") {
      throw Boom.unauthorized("Invalid token");
    } else {
      throw Boom.boomify(error);
    }
  }
}

module.exports = {
  createToken,
  verifyToken,
};
