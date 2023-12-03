//sendinblue kit
const SibApiV3Sdk = require('sib-api-v3-sdk');
const nodemailer = require('nodemailer');
const AppError = require('./AppError');

class Email {
  constructor(receiver, subject, message) {
    this.from = `${process.env.EMAIL_FROM}`;
    this.receiver = receiver;
    this.subject = subject;
    this.message = message;
  }

  async send() {
    try {
      if (process.env.NODE_ENV == 'production') {
        // mail option
        const mail_Options = {
          sender: {
            email: this.from,
          },
          to: [
            {
              email: this.receiver,
            },
          ],
          subject: this.subject,
          textContent: this.message,
        };
        const client = SibApiV3Sdk.ApiClient.instance;
        // Configure API key authorization: api-key
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.SENDINBLUE_API_KEY;
        const transEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();
        await transEmailApi.sendTransacEmail(mail_Options);
      } else {
        //mail options
        const mailOptions = {
          from: this.from,
          to: this.receiver,
          subject: this.subject,
          text: this.message,
        };
        await this.newTransport().sendMail(mailOptions);
      }
    } catch (err) {
      console.log(err);
      throw new AppError(err.message, 500);
    }
  }
  
  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
}

module.exports = Email;
