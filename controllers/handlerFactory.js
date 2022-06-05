const AppError = require('../../Natours/utils/appError');
const catchAsync = require('../util/catchAsync');

// Create one
exports.createOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.create(req.body);

		res.status(201).json({
			status: 'success',
			data: doc,
		});
	});

// Get all
exports.getAll = (Model) => {
	catchAsync(async (req, res, next) => {
		const doc = await Model.find();

		res.status(200).json({
			status: 'success',
			results: doc.length,
			data: doc,
		});
	});
};

// Get one
exports.getOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findById(req.params.id);

		if (!doc) {
			return next(new AppError('No document found with that Id', 400));
		}

		res.status(200).json({
			status: 'success',
			data: doc,
		});
	});
