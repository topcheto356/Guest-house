const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const houseRouter = require('./routes/houseRouter');
const userRouter = require('./routes/userRouter');
const reviewRouter = require('./routes/reviewRouter');

const app = express();

////////////////////////////////////////////////////////
// Middlewares

// set security http headers
app.use(helmet());

// HTTP requist logger
//  lunux & macOS - "start:prod": "NODE_ENV=production node server.js"
//  windows - "start:prod": "SET NODE_ENV=production & node server.js"
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

//rate timiter
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000, //1h
	message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/api', limiter);

//body parcer
app.use(express.json({ limit: '10kb' }));

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// data sanitization against XSS
// from html
app.use(xss());

//prevent parameter polution
app.use(
	hpp({
		whitelist: ['maxGroupSize', 'ratingsAverage', 'ratingsQuantity', 'price'],
	})
);

//serving static files
// app.use(express.static(path.join(__dirname), 'public'));

////////////////////////////////////////////////////////
//Routes
app.use('/api/houses', houseRouter);
app.use('/api/users', userRouter);
app.use('/api/reviews', reviewRouter);

app.all('*', (req, res, next) => {
	//if you pass argument in the next(), express will asume this is an error
	next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
