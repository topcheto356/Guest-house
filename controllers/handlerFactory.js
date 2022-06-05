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
exports.getAll = (MOdel) => {
	catchAsync(async (req, res, next) => {
		const doc = await Model.find();

		res.status(200).json({
			status: 'success',
			results: doc.length,
			data: doc,
		});
	});
};
