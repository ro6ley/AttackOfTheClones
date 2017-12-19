# Twitter Clone

## Server

This will house the API built with JavaScript.

---

Frameworks used:
--------------------
- Express
- Joi
- Chai
- Mocha
- Bcrypt
- Morgan
- Passport
- Mongoose

---

Endpoints:
==========
- `POST /auth/login/             - Logs in a user`
- `POST /auth/register/          - Registers a user`
- `GET /user/                    - Fetches the user's profile`
- `PUT /user/                    - Modify the user's profile`
- `DELETE /user/                 - Delete the user's account`
- `GET /user/<id>/               - Fetch another user's profile`
- `POST /user/<id>/follow/       - Follow a user`
- `GET /feed/                    - Get user's twitter feed`
- `POST /tweet/                  - Post a tweet`
- `GET /tweet/<id>/              - Fetch a tweet`
- `DELETE /tweet/<id>/           - Delete a tweet`
- `POST  /tweet/<id>/favorite    - Favorite a tweet`
- `POST /tweet/<id>/retweet      - Retweet a tweet`

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