const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const { validationResult } = require('express-validator');
const User = require('../models/User');

exports.signuser = async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { name, email, username, password } = req.body;

	try {
		// See if user exists
		let user = await User.findOne(email ? { email } : { username });
		if (user) {
			res.status(400).json({
				errors: [{ msg: 'User already exists' }],
			});
		}

		// Get user gravatar
		const avatar = gravatar.url(email, {
			s: '200',
			r: 'pg',
			d: 'mm',
		});

		user = new User({
			name,
			email,
			username,
			avatar,
			password,
		});

		// Encrypt password
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);
		await user.save();

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
