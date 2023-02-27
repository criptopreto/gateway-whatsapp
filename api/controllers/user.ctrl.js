"use strict";
const User = require("../services/user.service");
const Role = require("../services/role.service");
const Phone = require("../services/phone.service");
const Email = require("../services/email.service");
const { OTPMailer } = require("../helpers/mailers/otpmailer");
const jwt = require("../helpers/jwt");
const { HTTP_OK } = require("../helpers/constants/httpStatusCodes");
const Boom = require("boom");
const { WELCOME_EMAIL } = require("../helpers/constants/emailTypes");

const controllers = {
  signup: async (req, res, next) => {
    try {
      const { email, phone } = req.body;

      let defaultRole = await Role.findOne({ default: true });
      if (!defaultRole)
        throw Boom.badData(
          "There are no default role registered, please contact an administrator to create it before start registering users."
        );

      req.body.role = defaultRole;
      req.body.username = email;

      delete req.body.repeatPassword;

      // Create and assign phone
      let phone_doc = await Phone.create({ phone });
      let email_doc = await Email.create({ email });

      req.body.phone = phone_doc;
      req.body.email = email_doc;

      const user = await User.register(req.body);
      phone_doc._user = user._id;
      email_doc._user = user._id;
      await phone_doc.save();
      let refresh_email = await email_doc.save();

      // Remove sensitive information
      delete user?._doc?.hash;
      delete user?._doc?.salt;

      // Send OTP Email
      await new OTPMailer(email, refresh_email.email_otp, WELCOME_EMAIL).send();

      return res.status(HTTP_OK).send(user);
    } catch (err) {
      next(err);
    }
  },
  signin: async (req, res, next) => {
    try {
      let { user } = req;

      delete user?._doc?.hash;
      delete user?._doc?.salt;

      user._doc.token = jwt.createToken(user?._doc._id);
      user.last_login = new Date();
      await user.save();

      return res.json(user);
    } catch (error) {
      next(error);
    }
  },
  signout: async (req, res, next) => {
    try {
      req.logout((err) => {
        if (err) throw Boom.forbidden(err.message);
        res.status(HTTP_OK).json(true);
      });
    } catch (error) {
      next(error);
    }
  },
  session: (req, res, next) => {
    try {
      if (req.user) return res.status(HTTP_OK).json(req.user);
      throw Boom.unauthorized("Unauthorized");
    } catch (error) {
      next(error);
    }
  },
  get_all: async (req, res, next) => {
    try {
      let users = await User.findAll();
      return res.status(HTTP_OK).json(users);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = controllers;
