const Tweet = require('../models/tweetModel'),
	User = require('../models/userModel');

module.exports = {
	// Get all tweets
	// from users they follow - to be added later
	getTweets: async (req, res) => {
		const limit = req.query.limit || 5;
		const offset = req.query.offset || 5;
		const allTweets = await Tweet.find({});
		res.status(200).json({ success: true, tweets: allTweets });
	},
	// Get a single tweet
	getTweet: async (req, res) => {
		const { tweetID } = req.value.params;
		const tweet = await Tweet.findById(tweetID);
		if (tweet){
			res.status(200).json({ success: true, tweet: tweet });
		} else {
			res.status(404).json({ success: false, message: 'Tweet does not exist.' });
		}
        
	},
	// Create a tweet
	createTweet: async (req, res) => {
		const newTweet = new Tweet(req.value.body);
		// Get user ID ( decoded from token)
		const user = await User.findById(req.user.id);
		// Assign user as the owner of the tweet
		newTweet.user = user;
		// Save the tweet
		await newTweet.save();
		// Add tweet to user's tweets
		await user.tweets.push(newTweet);
		// Save the owner
		await user.save();
		res.status(201).json({ success: true, tweet: newTweet, message: 'Tweet sent successfully'});
	},
	// Update a tweet (PATCH)
	updateTweet: async (req, res) => {
		const { tweetID } = req.value.params;
		const newTweet = req.value.body;
		// Find the tweet and check access
		const tweet = await Tweet.findById(tweetID);
		if (tweet){
			const result = await Tweet.findByIdAndUpdate(tweetID, newTweet, {new: true});
			res.status(200).json({success: true, message: 'Tweet updated successfully'}); 
		} else {
			res.status(404).json({ success: false, message: 'Tweet does not exist or you do not have access to it' });
		}
	},
	// Replace a tweet (PUT)
	replaceTweet: async (req, res) => {
		const { tweetID } = req.value.params;
		const newTweet = req.value.body;
		// Find the tweet and check access
		const tweet = await Tweet.findById(tweetID);
		if (tweet){
			const result = await Tweet.findByIdAndUpdate(tweetID, newTweet, {new: true});
			res.status(200).json({success: true, message: 'Tweet updated successfully'});
		} else {
			res.status(404).json({ success: false, message: 'Tweet does not exist or you do not have access to it' });
		}         
	},
	// Delete a tweet
	deleteTweet: async (req, res) => {
		const { tweetID } = req.value.params;
		// Find the tweet and check access
		const tweet = await Tweet.findById(tweetID);
		if (tweet){
			const result = await Tweet.findByIdAndRemove(tweetID);
			// Remove from owner's list of tweets
			const owner = await User.findById(req.user.id);
			// owner.tweets.pull(tweet)
			owner.tweets = await owner.tweets.filter((tweet) => { 
				return tweet != tweetID;
			});
			await owner.save()
			// remember to remove from a user's list
			res.status(200).json({ success: true, message: 'Tweet deleted successfully'});
		} else {
			res.status(404).json({ success: false, message: 'Tweet does not exist or you are not allowed to delete it' });
		}
	},
	// Search for a tweet
	searchTweets: async (req, res) => {
		const query = new RegExp(req.query.q, 'i');
		const allTweets = await Tweet.find({ text: query });
		res.status(200).json({success: true, query: req.query.q, results: allTweets});
	}
};
