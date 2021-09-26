const { validationResult } = require('express-validator');
const User = require('../models/User');
const Post = require('../models/Posts');

exports.create = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		// Find user
		const user = await User.findById(req.user.id).select('-password');
		// Build pst object
		const newPost = new Post({
			text: req.body.text,
			name: user.name,
			avatar: user.avatar,
			user: req.user.id,
		});
		// Create post
		const post = await newPost.save();
		// Result/return
		res.json(post);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

exports.getAll = async (req, res) => {
	try {
		// Find posts
		const posts = await Post.find().sort({ date: -1 });
		// Result/return
		res.json(posts);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

exports.getbyID = async (req, res) => {
	try {
		// Find post
		const post = await Post.findById(req.params.id);
		// If not found
		if (!post) {
			return res.status(404).json({ msg: 'Post not found' });
		}
		// Result/return
		res.json(post);
	} catch (err) {
		console.error(err.message);
		// If not object ID
		if (err.kind == 'ObjectId') {
			return res.status(400).json({ msg: 'Post not found' });
		}
		res.status(500).send('Server Error');
	}
};

exports.delete = async (req, res) => {
	try {
		// Find post
		const post = await Post.findById(req.params.id);
		// If not found
		if (!post) {
			return res.status(404).json({ msg: 'Post not found' });
		}
		// Check user (if user not owned the post)
		if (post.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'User not authorized' });
		}
		// Delete post
		await post.remove();
		// Result/return
		res.json({ msg: 'Post removed' });
	} catch (err) {
		console.error(err.message);
		// If not object ID
		if (err.kind == 'ObjectId') {
			return res.status(400).json({ msg: 'Post not found' });
		}
		res.status(500).send('Server Error');
	}
};
