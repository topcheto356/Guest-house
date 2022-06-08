const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.setHouseUserIds = (req, res, next) => {
	// Allow nested routes
	if (!req.body.house) req.body.house = req.params.houseId;
	if (!req.body.user) req.body.user = req.user.id;
	next();
};

exports.getAllReviews = factory.getAll(Review);

exports.createReview = factory.createOne(Review);

exports.getReview = factory.getOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
