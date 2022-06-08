const AppError = require('../utils/appError');
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
		//to allow for nested Get review on tour
		let filter = {};

		//if there is tourid in the req is will return review for that tour
		//if not it will return all review
		if (req.params.houseId) {
			filter = { tour: req.params.houseId };
		}
		//EXECUTE QUERRY
		const features = new APIFeatures(Model.find(filter), req.query)
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
exports.getOne = (Model, populates) =>
	catchAsync(async (req, res, next) => {
		//do the query
		let query = Model.findById(req.params.id);

		//check if there are populate options
		//if they are add populate
		if (populates) query = query.populate(populates);

		const doc = await query;

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
