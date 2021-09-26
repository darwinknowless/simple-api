const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const { check } = require('express-validator');
const authController = require('../../controllers/auth');

// @route       GET api/auth
// @desc        Test route
// @access      public
router.get('/', auth, authController.getuser);

// @route       GET api/auth
// @desc        Authenticate user & get token
// @access      public
router.post(
	'/',
	[
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'Password is required').exists(),
	],
	authController.loguser
);

module.exports = router;
