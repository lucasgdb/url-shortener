const mongoose = require('mongoose');

const { Schema } = mongoose;

const urlSchema = new Schema({
	originalURL: {
		type: String,
		required: true,
	},
	shortenedURL: {
		type: String,
		required: true,
		unique: true,
	},
	userID: {
		type: String,
		required: false,
		select: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

mongoose.model('url', urlSchema);
