const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

const tweetSchema = new Schema({
	text: {
		type: String,
		required: 'Kindly enter the content of the tweet',
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	createdOn: {
		type: Date,
		default: Date.now,
	},
	retweetedBy: [{
		type: Schema.Types.ObjectId,
		ref: 'User',
	}],
	favoritedBy: [{
		type: Schema.Types.ObjectId,
		ref: 'User',
	}],
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;
