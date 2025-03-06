// models/userModel.js
const pool = require('../config/db');

const Token = {
	// Create email recovery token
	async createRecoveryToken(id, token) {
		const [result] = await pool.execute(
			'INSERT INTO email_recovery_tokens (user_id, token) VALUES (?, ?)',
			[id, token]
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
	async getRecoveryTokenData(token) {
		const [result] = await pool.execute(
			'SELECT user_id, created_at, token_used FROM email_recovery_tokens WHERE token = ?',
			[token]
		);
		return result[0];
	},

	// Update token used
	async updateTokenUsed(token) {
		const [result] = await pool.execute(
			'UPDATE email_recovery_tokens SET token_used = 1 WHERE token = ?', [token]
		);
		return result.affectedRows > 0;
	}
}

module.exports = Token;