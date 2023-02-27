const { Notifier } = require("./notifier");
class OTPsms extends Notifier {
  constructor(to, otp) {
    super();

    this.params = {
      to,
      body: this.buildBody(otp),
      ...this.params,
    };
  }

  buildBody(otp) {
    return `PruebaApp: Tu codigo de verificación es: ${otp}`;
  }
}

module.exports = { OTPsms };
