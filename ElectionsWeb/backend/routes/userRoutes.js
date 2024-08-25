// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// router.get('/users/:N_Id', userController.getUserByNId);
router.get('/:N_Id', userController.getUserByNId);

module.exports = router;