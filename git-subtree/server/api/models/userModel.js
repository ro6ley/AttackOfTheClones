const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: 'Kindly enter the username of the user'
    },
    names: {
        type: String
    },
    password: {
        type: String,
        required: 'Kindly enter the password of the user'
    },
    email: {
        type: String,
        required: 'Kindly enter the email of the user'
    },
    bio: String,
    tweets: [{
        type: Schema.Types.ObjectId,
        ref: 'Tweet'
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'Tweet'
    }]
});

userSchema.pre('save', function (next) {
    var user = this;

    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

const User = mongoose.model('User', userSchema);
module.exports = User;
