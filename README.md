[![HitCount](http://hits.dwyl.io/NaiRobley/TwitterClone.svg)](http://hits.dwyl.io/NaiRobley/TwitterClone) [![Build Status](https://travis-ci.org/NaiRobley/TwitterClone.svg?branch=master)](https://travis-ci.org/NaiRobley/TwitterClone) [![Coverage Status](https://coveralls.io/repos/github/NaiRobley/TwitterClone/badge.svg?branch=master)](https://coveralls.io/github/NaiRobley/TwitterClone?branch=master)
# Twitter Clone

## Server

This will house the API built with JavaScript.

---

Stacks:
--------------------
- Front-end: React-redux
- Backend: NodeJS, Express, MongoDB

---

Endpoints:
==========
- `POST /api/users/login/                      - Logs in a user`
- `POST /api/users/                            - Registers a user`
- `PUT /api/users/                             - Modify the user's profile`
- `DELETE /api/users/                          - Delete the user's account`
- `GET /api/users/<username>/                  - Fetches the user's profile`
- `POST /api/users/follow/<username>/          - Follow a user`
- `POST /api/users/unfollow/<username>/        - Unfollow a user`
- `POST /api/users/<username>/tweets           - Get a users tweets`
- `GET /api/tweets/                            - Get user's twitter feed`
- `POST /api/tweets/                           - Post a tweet`
- `GET /api/tweets/<id>/                       - Fetch a specific tweet`
- `DELETE /api/tweets/<id>/                    - Delete a specifc tweet`
- `POST  /api/tweets/<id>/favorite             - Favorite a specific tweet`
- `POST /api/tweets/<id>/retweet               - Retweet a specific tweet`

---

Models:
=======
**User** - 
> {
> "username" : "robley",
> "password" : "apassword",
> "email" : "robley@email.com",
> "bio" : "Just another tweep",
> "following" : [], *A list of all the ids of users a user follows*
> "followers" : [], *A list of all the ids of users that follow the user*
> "favorites" : [], *A list of all tweets a user has favorited*
> "private" : false,
> "tweets" : [] *A list of all the ids of a users tweets*
> }

**Tweet** - 
> {
> "text" : "Look at this tweet", *Content of the tweet*
> "user" : {}, *The user that posted the tweet*
> "retweeted_by" : [], *A list of all the ids of users that RT'd the tweet*
> "favorited_by" : [], *A list of all the ids of users that favorited a tweet*
> "created_at" : "November 21, 2017" *The time the tweet was created*
> }

## Client

Work in progress