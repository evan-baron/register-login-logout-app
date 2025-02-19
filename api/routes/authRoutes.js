const express = require("express");
const router = express.Router();
const authService = require('../services/authService');

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
		const { user } = await authService.login(email, password);

		res.status(201).json({
			message: 'User logged in successfully!',
			user
		});
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

module.exports = router;