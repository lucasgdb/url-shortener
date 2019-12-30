const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
	userEmail: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
	},
	userPassword: {
		type: String,
		required: true,
		select: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

mongoose.model('user', userSchema);
