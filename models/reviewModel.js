const mongoose = require('mongoose');
const House = require('./houseModel');

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
			max: 5,
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

reviewSchema.index({ house: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'user',
		select: 'name photo',
	});
	next();
});

reviewSchema.statics.calcAverageRatings = async function (houseId) {
	const stats = await this.aggregate([
		{
			$match: { house: houseId },
		},
		{
			$group: {
				_id: '$house',
				nRating: { $sum: 1 },
				avgRating: { $avg: '$rating' },
			},
		},
	]);
	// console.log(stats);

	if (stats.length > 0) {
		await House.findByIdAndUpdate(houseId, {
			ratingsQuantity: stats[0].nRating,
			ratingsAverage: stats[0].avgRating,
		});
	} else {
		await House.findByIdAndUpdate(houseId, {
			ratingsQuantity: 0,
			ratingsAverage: 4.5,
		});
	}
};

reviewSchema.post('save', function () {
	// this points to current review
	this.constructor.calcAverageRatings(this.house);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
	this.r = await this.findOne();
	// console.log(this.r);
	next();
});

reviewSchema.post(/^findOneAnd/, async function () {
	// await this.findOne(); does NOT work here, query has already executed
	await this.r.constructor.calcAverageRatings(this.r.house);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
