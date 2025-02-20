// services/userService.js
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel'); // Import the User model

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

// Get a user by email
const getUserByEmail = async (email) => {
  return await userModel.findUserByEmail(email);
};

// Check if a user exists by email
const checkIfUserExists = async (email) => {
  return await userModel.checkIfUserExists(email);
};

// Get user by ID
const getUserById = async (id) => {
  return await userModel.findUserById(id);
};

// Delete a user by ID
const deleteUser = async (id) => {
  return await userModel.deleteUserById(id);
};

module.exports = {
  createUser,
  authenticateUser,
  getUserByEmail,
  checkIfUserExists,
  getUserById,
  deleteUser
};
