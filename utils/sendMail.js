const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  //Create transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER_EMAIL_USERNAME,
      pass: process.env.SMTP_USER_PASSWORD,
    },
  });

  // send mail with defined transport object
  const message = {
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`, // sender address
    to: `${options.receiver}`, // list of receivers
    subject: options.subject, // Subject line
    html: options.html,
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
};

module.exports = sendMail;
