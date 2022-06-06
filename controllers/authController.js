const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../util/appError');
const catchAsync = require('../util/catchAsync');

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

exports.signUp = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		//Not add unwanted data
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
	});

	const token = signToken(newUser._id);

	res.status(201).json({
		status: 'success',
		token,
		data: {
			user: newUser,
		},
	});
});

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	// checks if the password and email exist
	if (!email || !password)
		next(new AppError('Please provide email and password'), 400);

	// check if the user exist and the password is correct
	const user = await User.findOne({ email }).select('+password');

	if (!user || !(await user.correctPassoword(password, user.password))) {
		return next(new AppError('Incorrect email or password', 401));
	}

	// if OK send response
	const token = signToken(user._id);

	res.status(200).json({
		status: 'success',
		token,
	});
});
