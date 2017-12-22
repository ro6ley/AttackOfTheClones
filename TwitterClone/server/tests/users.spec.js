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
    userCUsername = '';

describe('Tests for Users Functionality', () => {

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
                done();
            });          
    });    
    before((done) => {
        chai.request(app)
            .post('/api/tweets/')
            .set('token', userBToken)
            .send(testData.sampleTweetB)
            .end((err, res) => {
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

    describe('POST /api/users - Create a user with all the required attributes', () => {
        it('should successfully create a new user with all the required attributes', (done) => {
            const sampleUser = {
                username: 'sampleUser',
                names: 'Sample User',
                password: 'sampleUserPassword',
                email: 'sample@user.com',
                bio: 'A sample normal user'
            };
            chai.request(app)
                .post('/api/users')
                .send(sampleUser)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User successfully registered');
                    res.body.user.should.have.property('username');
                    res.body.user.should.have.property('email');
                  done();
                });
        });
    });

    describe('POST /api/users - Create a user without all the required attributes', () => {
        it('should return an  object with the message', (done) => {
            const user = {
                username: 'sampleUserB',
                password: 'sampleUserPassword'
            };
            chai.request(app)
                .post('/api/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.details.should.be.a('array');
                    res.body.details[0].should.have.property('message');
                  done();
                });
        });
    });

    describe('POST /api/users/login - Login as a registered user', () => {
        it('should return a success message and a token', (done) => {
            chai.request(app)
                .post('/api/users/login')
                .send({username: 'sampleUser', password: 'sampleUserPassword'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    res.body.should.have.property('success').eql(true);
                    done();
            });   
        });
    });

    describe('POST /api/users/login - Log in as a non existent user', () => {
        it('should return an error', (done) => {
            chai.request(app)
                .post('/api/users/login')
                .send({username: 'newuser', password: 'newpassword'})
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User not found');
                    res.body.should.have.property('success').eql(false);
                    done();
            });   
        });
    });

    describe('POST /api/users/login - Login with invalid/wrong credentials', () => {
        it('should return an error', (done) => {
            chai.request(app)
                .post('/api/users/login')
                .send({username: 'sampleUserA', password: 'WrongPword'})
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Wrong password');
                    res.body.should.have.property('success').eql(false);
                done();
            });   
        });
    });

    describe('PATCH /api/users/ Update a user\'s details', () => {
        it('should return success message', (done) => {
            chai.request(app)
                .patch('/api/users/')
                .set('token', userAToken)
                .send({ username: 'sampleUserANew',
                        email: 'sample@usernew.com',
                        bio: 'A sample new user'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Update successful');
                    res.body.should.have.property('success').eql(true);      
                    done();              
                });
        });
    });

    describe('PATCH /api/users/ - Update a user\'s details without auth', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .patch('/api/users/')
                .send({ username: 'sampleUserANew',
                        email: 'sample@usernew.com',
                        bio: 'A sample new user'})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Please provide a token, or login to get one');
                    res.body.should.have.property('success').eql(false);      
                    done();              
                });
        });
    });

    describe('PUT /api/users/ - Replace a user\'s details', () => {
        it('should return success message', (done) => {
            chai.request(app)
                .put('/api/users/')
                .set('token', userAToken)
                .send({ username: 'sampleAUser',
                        names: 'Another Name',
                        password: 'sampleAPassword',
                        email: 'sample@password.com',
                        bio: 'A sample admin'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Update successful');
                    res.body.should.have.property('success').eql(true);      
                    done();              
                });
        });
    });

    describe('PUT /api/users - Replace a user\'s details without auth', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .put('/api/users/')
                .send({ username: 'sampleAUser',
                        names: 'Another Name',
                        password: 'sampleAPassword',
                        email: 'sample@password.com',
                        bio: 'A sample admin'})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Please provide a token, or login to get one');
                    res.body.should.have.property('success').eql(false);      
                    done();              
                });
        });
    });

    describe('GET /api/users/:username/tweets/ - Get a user\'s tweets', () => {
        it('should return a list of the user\'s tweets', (done) => {
            chai.request(app)
                .get(`/api/users/${userBUsername}/tweets`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.tweets.should.be.a('array');
                    res.body.should.have.property('success').eql(true);      
                    done();   
                });
        });
    });

    describe('GET /api/users/ - Get all users', () => {
        it('should get a list of all users', (done) => {
            chai.request(app)
                .get('/api/users')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.users.should.be.a('array');
                    done();
                });
        });
    });

    describe('DELETE /api/users/ - Delete a user', () => {
        it('should return a success message', (done) => {
            chai.request(app)
                .delete('/api/users/')
                .set('token', userAToken)
                .end((err, res) => {
                    res.should.have.status(204);
                    res.should.be.a('object');
                    done();
                });
        });
    });

    describe('DELETE /api/users/ - Delete a user without auth', () => {
        it('should return an error message', (done) => {
            chai.request(app)
                .delete('/api/users/')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Please provide a token, or login to get one');
                    res.body.should.have.property('success').eql(false);      
                    done();
                });
        });
    });
    
    describe('POST /api/users/follow/:username - Follow a user', () => {
        it('should return a success message', (done) => {
            chai.request(app)
                .post('/api/users/follow/sampleUser')
                .set('token', userBToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('message').eql("User successfully followed");
                    done();
                });
        });
    });

    describe('POST /api/users/:username/follow - Follow the same user again', () => {
        it('should return a success message', (done) => {
            chai.request(app)
                .post('/api/users/follow/sampleUser')
                .set('token', userBToken)
                .end((err, res) => {
                    res.should.have.status(209);
                    res.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql("You have already followed this user");
                    done();
                });
        });
    });  
    
    describe('POST /api/users/unfollow/:username - Unfollow a user', () => {
        it('should return a success message', (done) => {
            chai.request(app)
                .post('/api/users/unfollow/sampleUser')
                .set('token', userBToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('message').eql("User successfully unfollowed");
                    done();
                });
        });
    });  

    describe('POST /api/users/unfollow/:username - Unfollow a user again', () => {
        it('should return a success message', (done) => {
            chai.request(app)
                .post('/api/users/unfollow/sampleUser')
                .set('token', userBToken)
                .end((err, res) => {
                    res.should.have.status(209);
                    res.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql("You are not following this user");
                    done();
                });
        });
    });  
});
