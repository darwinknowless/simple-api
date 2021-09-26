const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const { check } = require('express-validator');
const profileController = require('../../controllers/profile');

// @route       GET api/profile/me
// @desc        Get current users profile
// @access      private
router.get('/me', auth, profileController.me);

// @route       POST api/profile
// @desc        Create or update user profile
// @access      private
router.post(
	'/',
	[
		auth,
		[
			check('status', 'Status is required').not().isEmpty(),
			check('skills', 'Skills is required').not().isEmpty(),
		],
	],
	profileController.create
);

// @route       GET api/profile
// @desc        Get all profiles
// @access      public
router.get('/', profileController.get);

// @route       GET api/profile/user/:user_id
// @desc        Get profile by user ID
// @access      public
router.get('/user/:user_id', profileController.getbyID);

// @route       DELETE api/profile
// @desc        Delete profile, user & posts
// @access      private
router.delete('/', auth, profileController.delete);

// @route       PUT api/profile/experience
// @desc        Add profile experience
// @access      private
router.put(
	'/experience',
	[
		auth,
		[
			check('title', 'Title is required').not().isEmpty(),
			check('company', 'Company is required').not().isEmpty(),
			check('from', 'From date is required').not().isEmpty(),
		],
	],
	profileController.createEXP
);

// @route       DELETE api/profile/experience/:exp_id
// @desc        Delete experience from profile
// @access      private
router.delete('/experience/:exp_id', auth, profileController.deleteEXP);

// @route       PUT api/profile/education
// @desc        Add profile education
// @access      private
router.put(
	'/education',
	[
		auth,
		[
			check('school', 'School is required').not().isEmpty(),
			check('degree', 'Degree is required').not().isEmpty(),
			check('fieldofstudy', 'Field of study is required').not().isEmpty(),
			check('from', 'From date is required').not().isEmpty(),
		],
	],
	profileController.createEDU
);

// @route       DELETE api/profile/education/:exp_id
// @desc        Delete education from profile
// @access      private
router.delete('/education/:edu_id', auth, profileController.deleteEDU);

// @route       GET api/profile/github/:username
// @desc        Get user repos from Github
// @access      public
router.get('/github/:username', profileController.githubUSER);

module.exports = router;
