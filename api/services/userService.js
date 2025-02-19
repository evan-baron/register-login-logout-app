// services/userService.js
const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel'); // Import the User model

// Create a new user
const createUser = async (first_name, last_name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await UserModel.createUser(first_name, last_name, email, hashedPassword);

  return { id: result.insertId, first_name, last_name, email };
};

// Authenticate a user
const authenticateUser = async (email, password) => {
  const user = await UserModel.findUserByEmail(email);

  if (!user) {
    return { success: false, message: 'Incorrect email or password.' };
  }

  // Compare input password with stored hash
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { success: false, message: 'Incorrect email or password.' };
  }

  return { success: true, user };
}

// Get a user by email
const getUserByEmail = async (email) => {
  return await UserModel.findUserByEmail(email);
};

// Check if a user exists by email
const checkIfUserExists = async (email) => {
  return await UserModel.checkIfUserExists(email);
};

// Get user by ID
const getUserById = async (id) => {
  return await UserModel.findUserById(id);
};

// Delete a user by ID
const deleteUser = async (id) => {
  return await UserModel.deleteUserById(id);
};

module.exports = {
  createUser,
  authenticateUser,
  getUserByEmail,
  checkIfUserExists,
  getUserById,
  deleteUser
};
