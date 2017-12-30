const mysql = require('../database/databaseConnection');

const insertClubSQL = 'INSERT INTO club SET ?';
const selectSQL = 'SELECT * FROM club';

function teamByName(name, callback) {

    mysql.query(selectSQL + ' WHERE club_name=?', name, (err, result) => {

        if (err) throw err;

        if (result.length > 0) {
            callback(true);
        }
        else {
            callback(false);
        }
    });
}

const teamByID = (id, callback) => {

    mysql.query(selectSQL + ' WHERE club_id=?', id, (err, result) => {

        if (err) throw err;

        if (result.length > 0) {
            callback(result);
        }
        else {
            callback({"isSuccess": 0, "message": "Can't find a team based off that ID."});
        }
    });
}

const getAllTeams = (callback) => {

    mysql.query(selectSQL, (err, result) => {

        if (err) throw err;

        if (result.length > 0) {
            callback(result);
        }
    });
}

const insertTeam = (clubData, callback) => {

    teamByName(clubData.club_name, teamExists => {

        if (!teamExists) {
            mysql.query(insertClubSQL, clubData, (err, result) => {

                if (err) throw err;
                callback({"isSuccess": 1, "message": "You have successfully inserted a new team."});
            });
        }
        else {
            callback({"isSuccess": 0, "message": "A team with that name already exists."});
        }
    });
}

module.exports.insertTeam = insertTeam;
module.exports.teamByID = teamByID;
module.exports.getAllTeams = getAllTeams;