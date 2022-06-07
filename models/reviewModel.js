const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
	{
		review: {
			type: String,
			maxlength: [500, 'Review must less than 500 characters'],
			required: [true, 'Review can not be empty'],
		},
		rating: {
			type: Number,
			min: 1,
			mac: 5,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		house: {
			type: mongoose.Schema.ObjectId,
			ref: 'House',
			required: [true, 'Review must belong to a House'],
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'Review must belong to an User'],
		},
	},
	{
		//to use virtual properties
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
