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
}

module.exports = APIFeatures;
