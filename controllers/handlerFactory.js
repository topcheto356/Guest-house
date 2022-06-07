const AppError = require('../../Natours/utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

// Create one document
exports.createOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.create(req.body);

		res.status(201).json({
			status: 'success',
			data: doc,
		});
	});

// Get all documents
exports.getAll = (Model) =>
	catchAsync(async (req, res, next) => {
		//EXECUTE QUERRY
		const features = new APIFeatures(Model.find(), req.query)
			.filter()
			.sort()
			.limitFields()
			.paginate();
		const doc = await features.query;

		res.status(200).json({
			status: 'success',
			results: doc.length,
			data: doc,
		});
	});

// Get document
exports.getOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findById(req.params.id);

		if (!doc) {
			return next(new AppError('No document found with that Id', 404));
		}

		res.status(200).json({
			status: 'success',
			data: doc,
		});
	});

// Delete document
exports.deleteOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndDelete(req.params.id);

		if (!doc) {
			return next(new AppError('No document found with that Id', 404));
		}

		res.status(204).json({
			status: 'success',
			data: null,
		});
	});

// Update document
exports.updateOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!doc) {
			return next(new AppError('No document found with that Id', 404));
		}

		res.status(200).jason({
			status: 'success',
			data: doc,
		});
	});
