const express = require('express');
const router = express.Router();

// Adjust the path to the user controller file based on your directory structure
const userController = require('../controller/user');

// Define routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);

module.exports = router;
