const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL,
		pass: process.env.EMAIL_PASSWORD
	}
});

const getTemplate = (templateName, replacements = {}) => {
	const filePath = path.join(__dirname, '../services/emailTemplates', `${templateName}.html`);
	let template = fs.readFileSync(filePath, 'utf8');

	for (let key in replacements) {
		const regex = new RegExp(`{{${key}}}`, 'g');
		template = template.replace(regex, replacements[key]);
	}

	return template;
}

const sendPasswordResetEmail = async (user, resetToken) => {
	const { email } = user;

	//UPDATE BELOW WHEN YOU ADD THAT PART IN
	const resetLink = 'https://localhost:5173/reset-password?token=${resetToken}';

	const htmlContent = getTemplate('passwordReset', {
		resetLink,
		token: resetToken,
		supportEmail: 'marblrrecoveryteam@gmail.com'
	})

	const mailOptions = {
		from: process.env.EMAIL,
		to: email,
		subject: 'Password Reset Requested',
		html: htmlContent
	}

	try {
		await transporter.sendMail(mailOptions);
		console.log('Password reset email sent successfully');
	} catch (err) {
		console.error('Error sending email: ', err);
	}
};

module.exports = { sendPasswordResetEmail };