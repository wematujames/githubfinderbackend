const nodemailer = require("nodemailer");
const config = require("config");

const sendMail = async options => {
	//Create transport
	const transporter = nodemailer.createTransport({
		host: config.get("mail.smtpHost"),
		port: config.get("mailer.smtpPort"),
		auth: {
			user: config.get("mailer.smtpUserNameEmail"),
			pass: config.get("mailer.smtpPassword")
		}
	});

	// send mail with defined transport object
	const message = {
		from: `"${config.get("mailer.smtpaFromName")}" <${config.get(
			"mailer.smtpFromEmail"
		)}>`, // sender address
		to: `${options.receiver}`, // list of receivers
		subject: options.subject, // Subject line
		html: options.html
	};

	// send mail with defined transport object
	let info = await transporter.sendMail(message);

	console.log("Message sent: %s", info.messageId);
};

module.exports = sendMail;
