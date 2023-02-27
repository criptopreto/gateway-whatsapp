"use static";
const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

class Notifier {
  constructor() {
    this.config = {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    };

    this.params = {
      messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_ID,
    };
  }

  send() {
    return new Promise((res, rej) => {
      client.messages
        .create(this.params)
        .then((result) => {
          res(result);
        })
        .catch((err) => {
          rej(err);
        });
    });
  }
}

module.exports = {
  Notifier,
};
