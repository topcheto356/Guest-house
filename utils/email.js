const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
	// create transporter
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USERNAME,
			password: process.env.EMAIL_PASSWORD,
		},
	});

	// define email options
	const mailOptions = {
		from: 'Ivan Petrov <petur@gmail.com>',
		to: options.email,
		subject: options.subject,
		text: options.message,
	};

	// send the email
	//this is a promise
	await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
