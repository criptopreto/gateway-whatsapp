"use strict";
const otpGenerator = require("otp-generator");

const remove_from_array = (array, element) => {
  const index = array.indexOf(element);
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
};

function generateOtp() {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
}

function validate_token_header(headers) {
  // Validar el token de autorización
  try {
    const { authorization } = headers;
    if (!authorization || !authorization.toLowerCase().startsWith("bearer")) {
      throw Boom.unauthorized("Unauthorized");
    }
    return authorization.split(" ")[1];
  } catch (error) {
    next(error);
  }
}

module.exports = { remove_from_array, generateOtp, validate_token_header };
