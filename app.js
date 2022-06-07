const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const globalErrorHandler = require('./controllers/errorController');
const houseRouter = require('./routes/houseRouter');
const userRouter = require('./routes/userRouter');

const app = express();

////////////////////////////////////////////////////////
// Middlewares

// HTTP requist logger
//  lunux & macOS - "start:prod": "NODE_ENV=production node server.js"
//  windows - "start:prod": "SET NODE_ENV=production & node server.js"
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

//rate timiter
const limiter = {
	max: 100,
	windowMs: 60 * 60 * 1000, //1h
	message: 'Too many requests from this IP, please try again in an hour',
};
app.use('/api', limiter);

//serving static files
// app.use(express.static(path.join(__dirname), 'public'));

//body parcer
app.use(express.json());
////////////////////////////////////////////////////////
//Routes
app.use('/api/houses', houseRouter);
app.use('/api/users', userRouter);

app.use(globalErrorHandler);
module.exports = app;
