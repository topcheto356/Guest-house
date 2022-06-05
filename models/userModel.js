const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		trim: true,
		require: [true, 'User must have a name'],
		maxlength: [30, 'Fist name must be less than 30 characters'],
	},
	lastName: {
		type: String,
		trim: true,
		require: [true, 'User must have a name'],
		maxlength: [30, 'Fist name must be less than 30 characters'],
	},
	email: {
		type: String,
		require: [true, 'User must have an email'],
		unique: true,
		validator: [validator.isEmail, 'Enter valid email'],
	},
	password: {
		type: string,
		require: [true, 'User must have a password'],
		minlength: [8, 'A password must be minimum 8 characters'],
		select: false,
	},
	passwordConfirm: {
		type: String,
		required: [true, 'Confirm your password'],
		validate: {
			//only work on CREATE and SAVE!!!
			validator: function (el) {
				return el === this.password;
			},
			message: 'Passwords are NOT the same',
		},
	},
	active: {
		//Used when deleting
		type: Boolean,
		default: true,
		select: false,
	},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
