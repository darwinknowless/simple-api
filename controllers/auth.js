const User = require('../models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('config');

exports.getuser = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);
	} catch (err) {
		console.log(err.message);
		res.status(500).send('Server Error');
	}
};

exports.loguser = async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { email, username, password } = req.body;

	try {
		// See if user exists
		let user = await User.findOne(email ? { email } : { username });
		if (!user) {
			res.status(400).json({
				errors: [{ msg: 'Invalid Credentials' }],
			});
		}

		// Match password/compare
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			res.status(400).json({
				errors: [{ msg: 'Invalid Credentials' }],
			});
		}

		// Return jsonwebtoken
		const payload = {
			user: {
				id: user.id,
			},
		};

		jwt.sign(
			payload,
			config.get('JWT_SECRET'),
			{ expiresIn: 360000 },
			(err, token) => {
				if (err) throw err;
				res.json({ token });
			}
		);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};
