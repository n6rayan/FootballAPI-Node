const uuidv1 = require('uuid/v1');
const md5 = require('md5');

const uniqueID = name => {

    var hashVal = name + '-' + uuidv1();
    return md5(hashVal);
};

module.exports.uniqueID = uniqueID;