module.exports = {
    'DEVELOPMENT': {
        'SECRET': 'sup3rs3cR3t_K__eY',
        'DATABASE': 'mongodb://localhost:27017/dev_twitterdb',
        'PORT': 3001
    },
    'TESTING': {
        'SECRET': 'sup3rs3cR3t_K__eY',
        'DATABASE': 'mongodb://localhost:27017/test_twitterdb',
        'PORT': 3002
    },
    'STAGING': {
        'SECRET': 'sup3rs3cR3t_K__eY',
        'DATABASE': 'mongodb://localhost:27017/staging_twitterdb',
        'PORT': 3003
    },
    'PRODUCTION': {
        'SECRET': 'sup3rs3cR3t_K__eY',
        'DATABASE': 'mongodb://localhost:27017/prod_twitterdb',
        'PORT': 3000
    }
};