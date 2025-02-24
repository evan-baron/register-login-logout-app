const express = require("express");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const router = express.Router();
const authService = require('../services/authService');
const userService = require('../services/userService');
const mailService = require('../services/mailService');
const { authenticateUser } = require('../middlewares/authMiddleware');

// Middleware to parse cookies
router.use(cookieParser());

// ALL ROUTES SORTED ALPHABETICALLY

router.get('/authenticate', async (req, res) => {
	const token = req.headers.authorization?.split(' ')[1] || req.cookies.session_token;
	
	if (!token) {
		return res.status(401).json({ message: 'No token provided' });
	}
	
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		
		const user = await userService.getUserById(decoded.userId);
		
		return res.json({ user: user });
	} catch (error) {
		console.error('Error during token verification:', error.message);
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
});

router.post('/login', async (req, res) => {
	const { email, password, checked } = req.body;

	try {
		const { user, token } = await authService.login(email, password, checked);

		// Set HTTP-only cookie (more secure)
		res.cookie('session_token', token, {
			httpOnly: true, // Prevents JavaScript access
			secure: process.env.NODE_ENV === 'production', // Uses secure cookies in production
			sameSite: 'Strict', // Protects against CSRF
			maxAge: 60 * 60 * 1000, // 1 hour
		});

		res.status(201).json({
			message: 'User logged in successfully!',
			user,
			token // Sends token to clientside
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
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

router.post('/recover-password', async (req, res) => {
	const { email } = req.body;

	const recoveryToken = userService.generateRecoveryToken();
	console.log(recoveryToken);
	
	try {
		const { user } = await userService.getUserByEmail(email);

		console.log(user.email);

		try {
			await mailService.sendPasswordResetEmail(user.email, recoveryToken);
		} catch (err) {
			console.log('There was an error: ', err.message)
		}

		res.status(201).json({
			message: 'User found, recovery email sent!'
		});
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

router.post('/register', async (req, res) => {
	const { firstname, lastname, email, password } = req.body;

	try {
		const { user } = await authService.register(firstname, lastname, email, password);

		res.status(201).json({
			message: 'User registered successfully!',
			user
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = router;