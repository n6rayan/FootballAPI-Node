const mysql = require('../database/databaseConnection');

const teamByID = (name, callback) => {
    var selectSQL = 'SELECT * FROM club WHERE club_name=?';

    mysql.query(selectSQL, name, (err, result) => {
        if (err) throw err;

        if (result.length > 0) {

            callback(true);
        }
        else {

            callback(false);
        }
    });
}

module.exports.teamByID = teamByID;