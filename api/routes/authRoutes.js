const express = require("express");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const router = express.Router();
const authService = require('../services/authService');
const userService = require('../services/userService');
const { authenticateUser } = require('../middlewares/authMiddleware');

// Middleware to parse cookies
router.use(cookieParser());

router.get('/authenticate', async (req, res) => {
	const token = req.headers.authorization?.split(' ')[1];
	console.log(req.headers.authorization?.split(' ')[1]);

	if (!token) {
		return res.status(401).json({ message: 'No token provided' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		req.user = decoded;
		console.log(req.user);

		const user = await userService.getUserById(req.user.userId);
		console.log(user);

		return res.json({ user: user });
	} catch (error) {
		return res.status(401).json({ message: 'Invalid or expired token' });
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

router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		const { user, token } = await authService.login(email, password);

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

module.exports = router;