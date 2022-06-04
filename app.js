const path = require('path');
const express = require('express');
const morgan = require('morgan');

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

module.exports = app;
