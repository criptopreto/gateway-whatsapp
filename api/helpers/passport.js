"use strict";
const passport = require("passport");
const { Strategy: JWTStrategy, ExtractJwt } = require("passport-jwt");
const User = require("../services/user.service");
let opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  issuer: process.env.JWT_ISSUER,
  audience: process.env.JWT_AUDIENCE,
};

passport.use(
  new JWTStrategy(opts, function (jwt_payload, done) {
    User.findByIdPopulated(jwt_payload.sub).then((user) => {
      if (user) {
        console.log("Caracas");
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);
