"use strict";
const { Router } = require("express");
const {
  signup,
  signin,
  session,
  signout,
} = require("../../../controllers/user.ctrl");
const validate_request = require("../../../middlewares/validate_request");
const {
  signup_validator,
  signin_validator,
} = require("../../../schemas/user.sch");
const passport = require("passport");

const router = Router();

router.post("/signup", signup_validator, validate_request, signup);
router.post(
  "/signin",
  signin_validator,
  validate_request,
  passport.authenticate("local"),
  signin
);
router.get("/signout", signout);
router.get("/session", passport.authenticate("jwt"), session);

module.exports = router;
