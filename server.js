const mongoose = require('mongoose');
const dotenv = require('dotenv');

// read the env. variables before app file
dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD
);

// Connect DB
mongoose.connect(DB).then(() => {
	console.log('DB connection successful');
});

const port = process.env.PORT || 3000;

// Start server
const server = app.listen(port, () => {
	console.log(`App running on port ${port}`);
});
