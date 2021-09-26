const request = require('request');
const config = require('config');
const { validationResult } = require('express-validator');

const Profile = require('../models/Profile');
const User = require('../models/User');

exports.me = async (req, res) => {
	try {
		// Find profile user
		const profile = await Profile.findOne({ user: req.user.id }).populate(
			'user',
			['name', 'avatar']
		);
		// If no profile
		if (!profile) {
			return res.status(400).json({ msg: 'There is no profile for this user' });
		}
		// If success
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

exports.create = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	// Fields
	const {
		company,
		website,
		location,
		bio,
		status,
		githubusername,
		skills,
		youtube,
		facebook,
		twitter,
		instagram,
		linkedin,
	} = req.body;

	// Build profile object
	const profileFields = {};
	profileFields.user = req.user.id;
	if (company) profileFields.company = company;
	if (website) profileFields.website = website;
	if (location) profileFields.location = location;
	if (bio) profileFields.bio = bio;
	if (status) profileFields.status = status;
	if (githubusername) profileFields.githubusername = githubusername;
	if (skills) {
		profileFields.skills = skills.split(',').map((skill) => skill.trim());
	}

	// Build social object
	profileFields.social = {};
	if (youtube) profileFields.social.youtube = youtube;
	if (facebook) profileFields.social.facebook = facebook;
	if (twitter) profileFields.social.twitter = twitter;
	if (linkedin) profileFields.social.linkedin = linkedin;
	if (instagram) profileFields.social.instagram = instagram;

	try {
		// Find user
		let profile = await Profile.findOne({ user: req.user.id });
		// If profile found, update
		if (profile) {
			// Update
			profile = await Profile.findOneAndUpdate(
				{ user: req.user.id },
				{ $set: profileFields },
				{ new: true }
			);
			// Result/return
			return res.json(profile);
		}
		// If no profile found, create new
		// Create
		profile = new Profile(profileFields);
		await profile.save();
		// Result/return
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

exports.get = async (req, res) => {
	try {
		// Find all user & populate
		let profiles = await Profile.find().populate('user', ['name', 'avatar']);
		// Result/return
		res.json(profiles);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

exports.getbyID = async (req, res) => {
	try {
		// Find user by params ID & populate
		let profile = await Profile.findOne({
			user: req.params.user_id,
		}).populate('user', ['name', 'avatar']);
		// If not found
		if (!profile) return res.status(400).json({ msg: 'Profile not found' });
		// Result/return
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		// If not object ID
		if (err.kind == 'ObjectId') {
			return res.status(400).json({ msg: 'Profile not found' });
		}
		res.status(500).send('Server Error');
	}
};

exports.delete = async (req, res) => {
	try {
		// TODO - remove user posts

		// Remove profile
		await Profile.findOneAndRemove({ user: req.user.id });
		// Remove user
		await User.findOneAndRemove({ _id: req.user.id });

		// Result/return
		res.json({ msg: 'User deleted' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

exports.createEXP = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	// Fields
	const { title, company, location, from, to, current, description } = req.body;

	// Build new object
	const newExp = {
		title,
		company,
		location,
		from,
		to,
		current,
		description,
	};

	try {
		// Find profile user
		const profile = await Profile.findOne({ user: req.user.id });
		// Insert value in beginning of array "unshift"
		profile.experience.unshift(newExp);
		// Save data after insert value
		await profile.save();
		// Result/return
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

exports.deleteEXP = async (req, res) => {
	try {
		// Find profile user
		const profile = await Profile.findOne({ user: req.user.id });

		// Get remove index
		const removeIndex = profile.experience
			.map((item) => item.id)
			.indexOf(req.params.exp_id);
		// Splice array
		profile.experience.splice(removeIndex, 1);
		// Save data after splice
		await profile.save();
		// Result/return
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

exports.createEDU = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	// Fields
	const { school, degree, fieldofstudy, from, to, current, description } =
		req.body;

	// Build new object
	const newEdu = {
		school,
		degree,
		fieldofstudy,
		from,
		to,
		current,
		description,
	};

	try {
		// Find profile user
		const profile = await Profile.findOne({ user: req.user.id });
		// Insert value in beginning of array "unshift"
		profile.education.unshift(newEdu);
		// Save data after insert value
		await profile.save();
		// Result/return
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

exports.deleteEDU = async (req, res) => {
	try {
		// Find profile user
		const profile = await Profile.findOne({ user: req.user.id });

		// Get remove index
		const removeIndex = profile.education
			.map((item) => item.id)
			.indexOf(req.params.edu_id);
		// Splice array
		profile.education.splice(removeIndex, 1);
		// Save data after splice
		await profile.save();
		// Result/return
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

exports.githubUSER = async (req, res) => {
	try {
		const options = {
			uri: `https://api.github.com/users/${
				req.params.username
			}/repos?per_page=5&sort=created:asc&client_id=${config.get(
				'GITHUB_CLIENT_ID'
			)}&client_secret=${config.get('GITHUB_CLIENT_SECRET')}`,
			method: 'GET',
			headers: { 'user-agent': 'node.js' },
		};

		request(options, (error, response, body) => {
			if (error) console.error(error);

			if (response.statusCode !== 200) {
				return res.status(404).json({ msg: 'No github profile found' });
			}

			res.json(JSON.parse(body));
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};
