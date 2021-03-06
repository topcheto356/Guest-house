const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const houseSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'A house must have a name'],
			unique: true,
			trim: true,
			maxlength: [
				40,
				'A house name must have less or equal than 40 characters',
			],
		},
		slug: String,
		maxGroupSize: {
			type: Number,
			required: [true, 'A house must have a group size'],
		},
		ratingsAverage: {
			type: Number,
			default: 3,
			min: [1, 'Rating must be above 1.0'],
			max: [5, 'Rating must be less than 5.0'],
		},
		ratingsQuantity: {
			type: Number,
			default: 0,
		},
		price: {
			type: Number,
			required: [true, 'A house must have a price'],
		},
		summary: {
			type: String,
			trim: true,
			required: [true, 'A house must have a summary'],
			max: [250, 'A house summary msut be less than 250 characters'],
		},
		description: {
			type: String,
			trim: true,
			required: [true, 'A house must have a summary'],
			max: [1500, 'A house summary msut be less than 1500 characters'],
		},
		imageCover: {
			type: String,
			required: [true, 'A house must have image cover'],
		},
		images: [String],
		location: {
			type: String,
			required: [true, 'A house must have a location'],
			max: [100, 'A house location must be less than 100 characters'],
		},
		owners: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'User',
			},
		],
	},
	{
		//to use virtual properties
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

houseSchema.index({ slug: 1 });

// virtual populate
houseSchema.virtual('reviews', {
	ref: 'Review',
	foreignField: 'house',
	localField: '_id',
});

// Document middleware
//runs only before .save, .create
houseSchema.pre('save', function (next) {
	//create a name to be used for better looking url
	this.slug = slugify(this.name, { lower: true });
	next();
});

//Query middleware

//to populate owner field
houseSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'owners',
		select: '-__v -passwordChangedAt',
	});
	next();
});

const House = mongoose.model('House', houseSchema);

module.exports = House;
