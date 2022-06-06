const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
		type: String,
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
	photo: String,
	role: {
		type: String,
		enum: ['user', 'owner', 'admin'],
		default: 'user',
	},
	active: {
		//Used when deleting
		type: Boolean,
		default: true,
		select: false,
	},
	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpires: String,
});

//hashing the password
userSchema.pre('save', async function (next) {
	//if password field not changed
	if (!this.isModified('password')) return next();

	//hash is async func
	this.password = await bcrypt.hash(this.password, 12);

	//delete the passwordConfirm field (required only for the validation)
	this.passwordConfirm = undefined;

	next();
});

//instance method
userSchema.methods.correctPassoword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	// passwordChangedAt may not be even created
	if (this.passwordChangedAt) {
		//returned in msec and needed in sec
		const changedTimestamp = parentInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);

		return JWTTimestamp < changedTimestamp;
	}

	//False === Not changed
	return false;
};

userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex');

	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	console.log({ resetToken }, this.passwordResetToken);

	// expires in 10 min
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	// this only modifies the data (Not saving it)
	return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
