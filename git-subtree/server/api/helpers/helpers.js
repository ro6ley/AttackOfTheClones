'use strict';
const jwt = require('jsonwebtoken'),
      bcrypt = require('bcrypt'),
      Joi = require('joi');

module.exports = {
    // Generate a token when logging in
    generateToken: (payload) => {
        var token = jwt.sign(payload, 'SuperSecretKey', {
            expiresIn: 86400 // expires in 24 hours
        });
        return token;
    },
    // Verify a token on a request
    verifyToken: () => {
        return (req, res, next) => {
            if (!req.headers.token){
                res.status(400).json({ success: false, message: 'Please provide a token, or login to get one'});
            } else {
                const token = req.headers.token;
                jwt.verify(token, 'SuperSecretKey', (err, decoded) => {
                    if (err) {
                        res.status(400).json(err);
                    } else {
                        req.user = decoded;
                        next();
                    }
                });            
            }
        }
    },
    // Verify password during login or update
    confirmPassword: (password, hash) => {
        return bcrypt.compareSync(password, hash);
    },
    // Filter tweets based on the users a user follows
    filterTweets: (schema, name) => {},
    // Validation of the request parameters
    validateParam: (schema, name) => {
        return (req, res, next) => {
            const result = Joi.validate({ param: req['params'][name] }, schema);
            if (result.error) {
                return res.status(400).json(result.error);
            } else {
                if (!req.value) {
                    req.value = {};
                }
                if (!req.value['params']){
                    req.value['params'] = {};
                }
                req.value['params'][name] = result.value.param;
                next();
            }
        }
    },
    // Validation of the request body
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema);

            if (result.error) {
                return res.status(400).json(result.error);
            } else {
                if (!req.value) {
                    req.value = {};
                }

                if (!req.value['body']){
                    req.value['body'] = {};
                }
                req.value['body'] = result.value;
                next()
            }
        }
    },
    // Schemas to be used for validation
    schemas: {
        idSchema: Joi.object().keys({
            param: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required()
        }),
        usernameSchema: Joi.object().keys({
            param: Joi.string().required()
        }),
        // For POST and PUT requests validation
        userSchema: Joi.object().keys({
            username: Joi.string().required(),
            names: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            bio: Joi.string()
        }),
        // For PATCH requests validation
        userSchemaOptional: Joi.object().keys({
            username: Joi.string(),
            names: Joi.string(),
            email: Joi.string().email(),
            password: Joi.string(),
            bio: Joi.string()
        }),
        // For POST and PUT requests validation
        tweetSchema: Joi.object().keys({
            text: Joi.string().required()
        }),
        // For PATCH requests validation
        tweetSchemaOptional: Joi.object().keys({
            text: Joi.string()
        })        
    }
};
