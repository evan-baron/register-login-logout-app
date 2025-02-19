const express = require("express");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const router = express.Router();
const authService = require('../services/authService');
const { authenticateUser } = require('../middlewares/authMiddleware');

// Middleware to parse cookies
router.use(cookieParser());

router.post('/register', async (req, res) => {
	const { firstname, lastname, email, password } = req.body;

	try {
		const { user } = await authService.register(firstname, lastname, email, password);

		res.status(201).json({
			message: 'User registered successfully!',
			user
		});
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		const { user, token } = await authService.login(email, password);

		// Set HTTP-only cookie (more secure)
		res.cookie('session_token', token, {
			httpOnly: true, // Prevents JavaScript access
			secure: process.env.NODE_ENV === 'production', // Uses secure cookies in production
			sameSite: 'Strict', // Protects against CSRF
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});

		res.status(201).json({
			message: 'User logged in successfully!',
			user
		});
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

router.post('/logout', authenticateUser, (req, res) => {
    res.clearCookie('session_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
    });

    res.json({ message: 'Logged out successfully' });
});

module.exports = router;