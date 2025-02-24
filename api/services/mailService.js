const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL,
		pass: process.env.EMAIL_PASSWORD
	}
});

const sendPasswordResetEmail = async (toEmail, resetToken) => {
	const mailOptions = {
		from: process.env.EMAIL,
		to: toEmail,
		subject: 'Password Reset Request',
		text: `This is a password recovery email. This is the token: ${resetToken}.`
	}

	try {
		await transporter.sendMail(mailOptions);
		console.log('Password reset email sent successfully');
	} catch (err) {
		console.error('Error sending email: ', err);
	}
};

module.exports = { sendPasswordResetEmail };