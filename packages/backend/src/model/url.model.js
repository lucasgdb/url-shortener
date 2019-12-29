const mongoose = require('mongoose');

const { Schema } = mongoose;

const urlSchema = new Schema({
	originalURL: {
		type: String,
		required: true,
		unique: true,
	},
	shortenedURL: {
		type: String,
		required: true,
		unique: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

mongoose.model('url', urlSchema);
