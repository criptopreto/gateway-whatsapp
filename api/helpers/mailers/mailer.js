'use strict';
const nodemailer = require('nodemailer');

class Mailer {
  constructor() {
    this.transporter = nodemailer.createTransport({
 /*Google service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },*/ 

      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    this.mailOptions = {
      from: process.env.EMAIL_USER,
    };
  }

  send() {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(this.mailOptions, (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        resolve(true);
      });
    });
  }
}

module.exports = {
  Mailer,
};
