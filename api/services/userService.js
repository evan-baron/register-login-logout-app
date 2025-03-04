const bcrypt = require('bcrypt');
const crypto = require('crypto');
const userModel = require('../models/userModel'); // Import the User model

// ALL FUNCTIONS LISTED BELOW ALPHABETICALLY

// Authenticate a user
const authenticateUser = async (email, password) => {
  const hashedPassword = await userModel.getPasswordByEmail(email);
  if (!hashedPassword) {
    return { success: false, message: 'Incorrect email or password.' };
  }

  // Compare input password with stored hash
  const isMatch = await bcrypt.compare(password, hashedPassword);
  if (!isMatch) {
    return { success: false, message: 'Incorrect email or password.' };
  }

  const user = await userModel.findUserByEmail(email);

  return { success: true, user };
}

// Check if a user exists by email
const checkIfUserExists = async (email) => {
  return await userModel.checkIfUserExists(email);
};

// Create a new user
const createUser = async (first_name, last_name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await userModel.createUser(first_name, last_name, email, hashedPassword);

  const newUser = await userModel.findUserById(result.insertId);

  return {
		id: newUser.id,
		first_name: newUser.first_name,
		last_name: newUser.last_name,
		email: newUser.email,
		created_at: newUser.created_at,
	};
};

// Delete a user by ID
const deleteUser = async (id) => {
  return await userModel.deleteUserById(id);
};

// Get a user by email
const getUserByEmail = async (email) => {
  return await userModel.findUserByEmail(email);
};

// Get user by ID
const getUserById = async (id) => {
  return await userModel.findUserById(id);
};

// Generate recovery token
const generateRecoveryToken = (length = 32) => {
   const recoveryToken = crypto.randomBytes(length).toString('hex').slice(0, length);

   return recoveryToken;
};

module.exports = {
  authenticateUser,
  checkIfUserExists,
  createUser,
  deleteUser,
  getUserByEmail,
  getUserById,
  generateRecoveryToken
};
