// models/userModel.js
const pool = require('../config/db');

const Token = {
	// Create email recovery token
	async createRecoveryToken(email, token) {
		const [result] = await pool.execute(
			'INSERT INTO email_recovery_tokens (user_email, token) VALUES (?, ?)',
			[email, token]
		);
		return result;
	},

	// Authenticate email recovery token
	async authenticateRecoveryToken(token) {
		const [rows] = await pool.execute(
			'SELECT * FROM email_recovery_tokens WHERE token = ?',
			[token]
		);
		return rows[0];
	},

	// Get token created timestamp
	async getRecoveryTokenTimestamp(token) {
		const [result] = await pool.execute(
			'SELECT created_at FROM email_recovery_tokens WHERE token = ?',
			[token]
		);
		return result;
	}
}

module.exports = Token;