const User = require('../models/userModel');
const catchAsync = require('../util/catchAsync');

exports.signUp = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		//Not add unwanted data
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
	});

	res.status(201).json({
		status: 'success',
		data: {
			user: newUser,
		},
	});
});
