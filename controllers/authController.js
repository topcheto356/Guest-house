const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

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

exports.protect = catchAsync(async (req, res, next) => {
	//  get token and check of its's there
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}

	if (!token) {
		return next(
			new AppError('You are not logged in! Please log in to get access.', 401)
		);
	}

	// verification token
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	// checks if the user still exist (user is deleted after token issued)
	const freshUser = await User.findById(decoded.id);

	if (!freshUser) return next(new AppError('The user no longer exist', 401));

	// checks if the user changed his password after the token was issued
	if (freshUser.changedPasswordAfter(decoded.iat)) {
		return next(
			new AppError('User changed password. Please log in again', 401)
		);
	}

	//grand access to protected route
	req.user = freshUser;
	next();
});

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next('You don not have pemission to perform this action', 403);
		}
		next();
	};
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
	// get user on given email
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return next(new AppError('There is no user with that email', 404));
	}

	// generate the random reset token
	const resetToken = user.createPasswordResetToken();

	//save the data
	await user.save({ validateBeforeSave: false });

	// send email
	const resetURL = `${req.protocol}://${req.get(
		'host'
	)}/users/resetPassword/${resetToken}`;

	const message = `Go to the link to reset the password: ${resetURL}`;

	//if error in sendEmail
	try {
		await sendEmail({
			email: user.email,
			subject: 'Your password reset Token. Valid for 10min',
			message,
		});
		res.status(200).json({
			status: 'success',
			message: 'Token send',
		});
	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });

		next(
			new AppError(
				'There was a problem sending the email. Please try again later',
				500
			)
		);
	}
});

exports.resetPassword = catchAsync(async (req, res, next) => {
	// hash thee token to compare it
	const hashedToken = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');

	// get user based on token and check if the token is expired
	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});

	if (!user) {
		return next('Token is invalid pr has expired', 400);
	}

	//set new password
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetExpires = undefined;
	user.passwordResetToken = undefined;

	await user.save();

	//update passwordChangedAt field

	//log user in
	console.log(user._id);
	const token = signToken(user._id);

	res.status(200).json({
		status: 'success',
		token,
	});
});
