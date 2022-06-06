const AppError = require('../utils/appError');

// handle cast error DB
const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}`;
	return new AppError(message, 400);
};

// handle dubpicated field DB
const handleDuplicateFieldsDB = (err) => {
	const value = err.keyValue.name;
	const message = `Dublicate field value: ${value}. Please use another name!`;
	return new AppError(message, 400);
};

// handle valitation error DB
const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = `Invalid input data. ${errors.join('. ')}`;

	return new AppError(message, 400);
};

// handle wrong token JWT
const handleWrongTokenErrorJWT = () =>
	new AppError('Invalid token. Please log in again', 401);

// handle expired token JWT
const handleExpiredTokenErrorJWT = () =>
	new AppError('Your token expired. Please log in again', 401);

// Development error
const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};

// Production error
const sendErrorProd = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		res.status(500).json({
			status: 'error',
			message: 'Something went wrong',
		});
	}
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === 'production') {
		// deep copy the obj
		let error = JSON.parse(JSON.stringify(err));

		//MongoDB Errors
		//wrong id
		if (error.name === 'CastError') error = handleCastErrorDB(error);
		//dublicated field
		if (error.code === 11000) error = handleDuplicateFieldsDB(error);
		//validation error
		if (error.name === 'ValidationError')
			error = handleValidationErrorDB(error);

		//JWT Errors
		//wrong token
		if (error.name === 'JsonWebTokenError') error = handleWrongTokenErrorJWT();
		//expired token
		if (error.name === 'TokenExpiredError')
			error = handleExpiredTokenErrorJWT();

		sendErrorProd(error, res);
	}
};
