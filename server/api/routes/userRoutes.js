const express = require('express'),
      router = require('express-promise-router')(),
      usersController = require('../controllers/userController'),
      // Middleware
      { validateParam, validateBody, schemas, verifyToken } = require('../helpers/helpers');

router.route('/follow/:username/')
    .post([verifyToken(), validateParam(schemas.usernameSchema, 'username')],
            usersController.followUser);

router.route('/search/')
    .get(usersController.searchUser);

router.route('/unfollow/:username/')
    .post([verifyToken(), validateParam(schemas.usernameSchema, 'username')],
          usersController.unfollowUser);

router.route('/login/')
    .post(usersController.login);

router.route('/logout/')
    .post(verifyToken(), usersController.logout);

router.route('/')
    .get(usersController.getUsers)
    .post(validateBody(schemas.userSchema), usersController.registerUser)
    .put([verifyToken(), validateBody(schemas.userSchema)],
         usersController.replaceUser)
    .patch([verifyToken(), validateBody(schemas.userSchemaOptional)],
           usersController.updateUser)
    .delete(verifyToken(), usersController.deleteUser);

router.route('/:username/tweets/')
    .get([validateParam(schemas.usernameSchema, 'username')],
         usersController.userTweets);

router.route('/:username/')
    .get([verifyToken(), validateParam(schemas.usernameSchema, 'username')],
         usersController.getUser);

module.exports = router;
