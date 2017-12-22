'use strict';

const express = require('express'),
      logger = require('morgan'), 
      mongoose = require('mongoose'), 
      bodyParser = require('body-parser'), 
      app = express(),
      config = require('../config'),
      // Import the routes
      userRoutes = require('./api/routes/userRoutes'),
      tweetRoutes = require('./api/routes/tweetRoutes');

// Connect to mongoose
mongoose.Promise = global.Promise;
mongoose.connect(config[process.env.NODE_ENV]['DATABASE'], { useMongoClient: true });

// Middleware
app.use(logger('dev'));
app.use(bodyParser.json());

// Routes
app.use('/api/users/', userRoutes);
app.use('/api/tweets/', tweetRoutes);

// Catch 404 Errors and forward them to error handlers
app.use((req, res, next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
});

// Error handler function
app.use((err, req, res, next) => {
    const error = app.get('env') === 'DEVELOPMENT' ? err : {};
    const status = err.status || 500;
    // Respond to client
    res.status(status).json({
        error: {
            message: error.message
        }
    });
    console.error(err);
});

// Start the server
const port = config[process.env.NODE_ENV]['PORT'] || 3005;
app.listen(port, () => console.log(`Server is listening on port ${port}`));

module.exports = app; // for testing
