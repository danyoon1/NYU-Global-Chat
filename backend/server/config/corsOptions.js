const whitelist = require('./whitelist');

const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('not allowed by CORS'));
        }
    },
    optionsSuccessStats: 200
}

module.exports = corsOptions;