const timestamp = require('unix-timestamp');

timestamp.round = true;

const epoch = () => {

    return timestamp.now();
};

module.exports.epoch = epoch;