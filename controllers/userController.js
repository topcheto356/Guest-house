const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../../Natours/utils/appError');
const factory = require('./handlerFactory');

//filter the updated data
const filterObj = (obj, allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
	// create error if user post password data

	if (req.body.password || req.body.passwordConfirm) {
		return next(
			new AppError(
				'This route is not for password update. Please use /updateMyPassword',
				400
			)
		);
	}

	//filter fields names that are not allowed to be updated
	const allowedFields = ['firstName', 'lastName', 'email'];
	const filteredBody = filterObj(req.body, allowedFields);

	// update doc
	const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		status: 'success',
		data: {
			user: updatedUser,
		},
	});
});

exports.deleteMe = catchAsync(async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, { active: false });

	res.status(204).json({
		status: 'success',
		data: null,
	});
});

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);

exports.createUser = (req, res) => {
	res.status(500).json({
		status: 'err',
		message: 'This route is not yet defined! Please use sign up instead',
	});
};

exports.deleteUser = factory.deleteOne(User);

//Do Not update password with this
exports.updateUser = factory.updateOne(User);
