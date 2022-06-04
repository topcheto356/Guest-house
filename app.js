const path = require('path');const express = require('express');
const morgan = require('morgan');

const app = express();

//serving static files
// app.use(express.static(path.join(__dirname), 'public'));

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
//
module.exports = app;
