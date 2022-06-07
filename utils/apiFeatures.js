class APIFeatures {
	constructor(query, queryStr) {
		this.query = query;
		this.queryStr = queryStr;
	}

	filter() {
		//1a)Filtering
		//creating a copy
		const queryObj = { ...this.queryStr };

		//excluding fields when filtering
		const excludedFields = ['page', 'limit', 'sort', 'fields'];

		//deleting excluded fields
		excludedFields.forEach((el) => delete queryObj[el]);

		//1b)Advanced filtering
		let queryStr = JSON.stringify(queryObj);

		//replacing gte|gt|lte|lt with $gte|$gt|$lte|$lt so the mongose can use it as a filter
		//gte|gt|lte|lt
		//127.0.0.1:3000/api/v1/tours?duration=5&difficulty[gte]=easy&sort=1&limit=10&price[lt]=1500
		queryStr = queryStr.replace(/\b(gt|gt|lte|lt\b)/g, (match) => `$${match}`);

		this.query = this.query.find(JSON.parse(queryStr));

		return this;
	}

	sort() {
		//2) Sorting

		//127.0.0.1:3000/api/v1/tours?sort=price,ratingsAverage
		//127.0.0.1:3000/api/v1/tours?sort=-price
		//sort('price ratingsAverage')
		if (this.queryStr.sort) {
			const sortBy = this.queryStr.sort.split(',').join(' ');
			this.query = this.query.sort(sortBy);
		} else {
			//Defaulth
			this.query = this.query.sort('-createdaAt');
		}

		return this;
	}

	limitFields() {
		// 3) Field limiting

		//showing only needed fields

		//127.0.0.1:3000/api/v1/tours?fields=name,duration,price
		//127.0.0.1:3000/api/v1/tours?fields=-name,-duration,price

		if (this.queryStr.fields) {
			const fields = this.queryStr.fields.split(',').join(' ');
			this.query = this.query.select(fields);
		} else {
			//Defaulth
			//excluding __v field (made by mongoose)
			this.query = this.query.select('-__v');
		}

		return this;
	}
	paginate() {
		// Pagination

		//127.0.0.1:3000/api/v1/tours?page=2&limit=10
		//page=2&limit=10

		const page = this.queryStr.page * 1 || 1;
		const limit = this.queryStr.limit * 1 || 100;
		const skip = (page - 1) * limit;
		//1-10 for page 1 and 11-20 for page 2 ......

		this.query = this.query.skip(skip).limit(limit);

		//if the selected page is doesnt exist
		// if (req.query.page) {
		//   const numberTours = await Tour.countDocuments();

		//   if (skip >= numberTours) throw new Error('This page deast not exist');
		// }

		return this;
	}
}

module.exports = APIFeatures;
