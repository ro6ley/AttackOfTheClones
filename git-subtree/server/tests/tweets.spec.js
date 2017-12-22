'use strict';

process.env.NODE_ENV = 'TESTING';

const chai = require('chai'),
      should = chai.should(),
      app = require('../server'),
      mongoose = require('mongoose'),
      User = require('../api/models/userModel'),
      Tweet = require('../api/models/tweetModel'),
      testData = require('./test_data');

chai.use(require('chai-http'));

let userAToken = '',
    userBToken = '',
    userCToken = '',
    userAUsername = '',
    userBUsername = '',
    userCUsername = '',
    tweetA = {},
    tweetB = {},
    tweetC = {};

describe('Tests for Tweets Functionality', () => {

    // Create a sample  user
    before((done) => {
        chai.request(app)
            .post('/api/users/')
            .send(testData.sampleUserA)
            .end((err, res) => {
                done();
            });
    });
    // Log in as a sample  user
    before((done) => {
        chai.request(app)
        .post('/api/users/login/')
        .send(testData.sampleUserA)
        .end((err, res) => {
            userAToken = res.body.token;
            userAUsername = res.body.username;
            done();
        });   
    });
    // Create another sample user
    before((done) => {
        chai.request(app)
            .post('/api/users/')
            .send(testData.sampleUserB)
            .end((err, res) => {
                done();
            });        
    });
    before((done) => {
        chai.request(app)
            .post('/api/users/')
            .send(testData.sampleUserC)
            .end((err, res) => {
                done();
            });
    });
    // Log in as another sample user
    before((done) => {
        chai.request(app)
            .post('/api/users/login/')
            .send(testData.sampleUserB)
            .end((err, res) => {
                userBToken = res.body.token;
                userBUsername = res.body.username;
            done();
        });   
    });    
    // Post a tweet as user A
    before((done) => {
        chai.request(app)
            .post('/api/tweets/')
            .set('token', userAToken)
            .send(testData.sampleTweetA)
            .end((err, res) => {
                tweetA = res.body.tweet;
                done();
            });          
    });
    // Post a tweet as user B
    before((done) => {
        chai.request(app)
            .post('/api/tweets/')
            .set('token', userBToken)
            .send(testData.sampleTweetB)
            .end((err, res) => {
                tweetB = res.body.tweet;
                done();
            });          
    });    
    before((done) => {
        chai.request(app)
            .post('/api/tweets/')
            .set('token', userBToken)
            .send(testData.sampleTweetC)
            .end((err, res) => {
                tweetC = res.body.tweet;
                done();
            });          
    });
    after((done) => {
        // Remove the users
        User.remove({}, (err) => {
            done();
        });
    });
    after((done) => {
        // Remove the tweets
        Tweet.remove({}, (err) =>{
            done();
        });
    });

    describe('POST /api/tweets - Create a tweet with all the required attributes', () => {
        it('should successfully create a new tweet with all the required attributes', (done) => {
            const sampleTweet = {
                text: 'Test tweet'
            };
            chai.request(app)
                .post('/api/tweets')
                .set('token', userAToken)
                .send(sampleTweet)
                .end((err, res) => {
                    tweetC = res.body.tweet;
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Tweet sent successfully');
                    res.body.should.have.property('success').eql(true);
                  done();
                });
        });
    });

    describe('POST /api/tweets - Create a tweet without auth', () => {
        it('should return an error message', (done) => {
            const sampleTweet = {
                text: 'Test tweet'
            };
            chai.request(app)
                .post('/api/tweets')
                .send(sampleTweet)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Please provide a token, or login to get one');
                    res.body.should.have.property('success').eql(false);      
                    done();    
                });
        });
    });

    describe('GET /api/tweets - Fetch a single tweet', () => {
        it('should return an object with the tweet', (done) => {
            chai.request(app)
                .get(`/api/tweets/${tweetC._id}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('tweet');
                    res.body.should.have.property('success').eql(true);
                  done();
                });
        });
    });

    describe('GET /api/tweets/:tweetID - Fetch a single tweet that does not exists', () => {
        it('should return an error object', (done) => {
            chai.request(app)
                .get('/api/tweets/5a3931ba01bd6c37228476ac')
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Tweet does not exist.');
                    res.body.should.have.property('success').eql(false);
                  done();
                });
        });
    });

    describe('GET /api/tweets - Fetch all tweets', () => {
        it('should return an object with the tweets', (done) => {
            chai.request(app)
                .get('/api/tweets/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('tweets');
                    res.body.should.have.property('success').eql(true);
                  done();
                });
        });
    });

    describe('DELETE /api/tweets - Delete a single tweet', () => {
        it('should return  success message', (done) => {
            chai.request(app)
                .delete(`/api/tweets/${tweetC._id}`)
                .set('token', userAToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Tweet deleted successfully');
                    res.body.should.have.property('success').eql(true);
                  done();
                });
        });
    });

    describe('DELETE /api/tweets - Delete a single tweet without auth', () => {
        it('should return  success message', (done) => {
            chai.request(app)
                .delete(`/api/tweets/${tweetC._id}`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Please provide a token, or login to get one');
                    res.body.should.have.property('success').eql(false);      
                    done();  
                });
        });
    });

    describe('DELETE /api/tweets/:tweetID - Delete a single tweet that does not exists', () => {
        it('should return an error object', (done) => {
            chai.request(app)
                .delete('/api/tweets/5a3931ba01bd6c37228476ac')
                .set('token', userAToken)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Tweet does not exist or you are not allowed to delete it');
                    res.body.should.have.property('success').eql(false);
                  done();
                });
        });
    });

});
