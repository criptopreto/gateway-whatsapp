const Boom = require("boom");
const { validate_token_header } = require("../helpers/auxfunctions");
const { ACCOUNT_RECOVERY_EMAIL } = require("../helpers/constants/emailTypes");
const { HTTP_OK } = require("../helpers/constants/httpStatusCodes");
const { verifyToken, createToken } = require("../helpers/jwt");
const { OTPMailer } = require("../helpers/mailers/otpmailer");
const { OTPsms } = require("../helpers/notifiers/otpsms");
const emailService = require("../services/email.service");
const phoneService = require("../services/phone.service");
const userService = require("../services/user.service");
const User = require("../services/user.service");

const controllers = {
  validate_email_token: async (req, res, next) => {
    try {
      const { token } = req.body;
      if (!token) throw Boom.unauthorized("Unauthorized");
      const { email, otp } = verifyToken(token);
      if (!email) throw Boom.badRequest("Missing email");
      if (!otp) throw Boom.badRequest("Missing OTP");

      const email_doc = await emailService.findByEmail(email);

      if (!email_doc) throw Boom.badRequest("Email not found");

      const user = await User.findById(email_doc._user);

      if (!user || email_doc.email_otp !== otp)
        throw Boom.badRequest("Invalid data");

      user.activated = true;
      if (!user.activated_by) user.activated_by = "email";
      email_doc.email_validated = true;
      if (!email_doc.activated_at) email_doc.activated_at = new Date();

      await user.save();
      let refresh_email = await email_doc.save();

      const refresh_token = createToken({
        email,
        otp: refresh_email.email_otp,
        type: "email",
      });

      return res.status(HTTP_OK).send(refresh_token);
    } catch (error) {
      next(error);
    }
  },
  validate_phone_send_token: async (req, res, next) => {
    try {
      const { phone } = req.body;
      if (!phone) throw Boom.badRequest("Invalid phone");

      const phone_doc = await phoneService.findByNumber(phone);
      if (!phone_doc) throw Boom.badRequest("Invalid phone");

      let renew_phone_doc = await phone_doc.save(); // Force renew OTP Code

      await new OTPsms(
        `+${renew_phone_doc.phone}`,
        renew_phone_doc.phone_otp
      ).send();
      let token = createToken(renew_phone_doc.phone, "10m");

      return res.status(HTTP_OK).send(token);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  verify_email_send_token: async (req, res, next) => {
    try {
      const { email } = req.body;

      if (!email) throw Boom.badRequest("Missing email");

      let user = await emailService.findByEmail(email);
      if (!user) throw Boom.badRequest("User not found");

      let payload = {
        email,
        otp: user.email_otp,
      };
      let token = createToken(payload);

      await new OTPMailer(email, user.email_otp, ACCOUNT_RECOVERY_EMAIL).send();

      return res.status(HTTP_OK).json(token);
    } catch (error) {
      next(error);
    }
  },
  validate_phone_otpsms: async (req, res, next) => {
    try {
      let token = validate_token_header(req.headers);
      if (!token) throw Boom.unauthorized("Invalid token");

      const { otp } = req.body;
      if (!otp) throw Boom.badRequest("Invalid OTP");

      let result = verifyToken(token);
      if (!result || typeof result !== "string")
        throw Boom.badRequest("Ivalid Token value");

      let phone_doc = await phoneService.findOne({
        phone: result,
        phone_otp: otp,
      });

      if (!phone_doc) throw Boom.badRequest("Invalid Phone");

      let user = await userService.findOne({ phone: phone_doc._id });
      if (!user) throw Boom.badRequest("User is not associated to phone");

      user.activated = true;
      phone_doc.phone_validated = true;
      if (!phone_doc.activated_at) phone_doc.activated_at = new Date();

      if (!user.activated_by) user.activated_by = "phone";

      await user.save();

      let refresh_phone = await phone_doc.save();

      const refresh_token = createToken({
        phone: refresh_phone.phone,
        otp: refresh_phone.phone_otp,
        type: "phone",
      });

      return res.status(HTTP_OK).send(refresh_token);
    } catch (error) {
      next(error);
    }
  },
  change_password: async (req, res, next) => {
    try {
      let token = validate_token_header(req.headers);

      // Validar que los passwords coincidan
      const { password, repeat_password } = req.body;
      if (password !== repeat_password) {
        throw Boom.badRequest("Passwords do not matchs");
      }

      // Verificar el token
      const { type, email, phone, otp } = verifyToken(token);
      if (!otp) {
        throw Boom.badRequest("Bad OTP");
      }

      // Buscar el usuario
      let service_doc;
      if (type === "email") {
        service_doc = await emailService.findByEmail(email);
      } else {
        service_doc = await phoneService.findByNumber(phone);
      }
      if (!service_doc) {
        throw Boom.badRequest(`Wrong ${type}`);
      }

      // Validar el OTP
      if (service_doc[`${type}_otp`] !== otp) {
        throw Boom.badRequest("Invalid OTP");
      }

      let user = await User.findById(service_doc._user);
      if (!user) throw Boom.badRequest("Invalid user");

      // Actualizar el usuario y el servicio
      service_doc[`${type}_validated`] = true;
      await service_doc.save();
      await user.setPassword(password);
      user.last_password_changed = new Date();
      await user.save();

      return res.status(HTTP_OK).json({ success: true });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = controllers;
