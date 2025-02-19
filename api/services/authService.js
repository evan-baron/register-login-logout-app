const userService = require('./userService'); 
require("dotenv").config();


// Register service function
const register = async (firstname, lastname, email, password) => {
    // Find the user by email
    const user = await userService.getUserByEmail(email);
    if (user) {
        throw new Error('An account with this email already exists.');
    } else {
		try {
			const newUser = await userService.createUser(firstname, lastname, email, password);
			return { user: newUser }
		} catch (err) {
			throw new Error('Error registering user: ' + err.message);
		}
	}
};

const login = async (email, password) => {
	const user = await userService.authenticateUser(email, password);
	
	if (user.success) {
		return user;
	} else {
		throw new Error(user.message);
	}
}

module.exports = { register, login };
