const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Define route for getting users
router.get('/getUser', usersController.getUsers);

module.exports = router;
