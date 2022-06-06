const path = require('path');
const express = require('express');
const morgan = require('morgan');

const globalErrorHandler = require('./controllers/errorController');
const houseRouter = require('./routes/houseRouter');
const userRouter = require('./routes/userRouter');

const app = express();

////////////////////////////////////////////////////////
// Middlewares

//serving static files
// app.use(express.static(path.join(__dirname), 'public'));

// HTTP requist logger
//  lunux & macOS - "start:prod": "NODE_ENV=production node server.js"
//  windows - "start:prod": "SET NODE_ENV=production & node server.js"
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

//body parcer
app.use(express.json({ limit: '10kb' }));
////////////////////////////////////////////////////////
//Routes
app.use('/houses', houseRouter);
app.use('/users', userRouter);

app.use(globalErrorHandler);
module.exports = app;
