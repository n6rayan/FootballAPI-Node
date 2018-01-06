const mysql = require('../database/databaseConnection');

const insertClubSQL = 'INSERT INTO club SET ?';
const selectSQL = 'SELECT * FROM club';
const updateSQL = 'UPDATE club SET ? WHERE club_id=?';

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

const teamByID = (id, use, callback) => {

    mysql.query(selectSQL + ' WHERE club_id=?', id, (err, result) => {

        if (err) throw err;

        if (result.length > 0) {
            if (use) callback(result);
            if (!use) callback (true);
        }
        else {
            if (use) callback({"isSuccess": 0, "message": "Can't find a team based off that ID."});
            if (!use) callback(false);
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

const updateTeam = (data, id, callback) => {

    mysql.query(updateSQL, [data, id], (err, result) => {

        teamByID(id, 0, teamExists => {

            if (teamExists) {
                callback({"isSuccess": 1, "message": "Team with ID of " + id + " has been updated"});
            }
            else {
                callback({"isSuccess": 0, "message": "A team with that ID does not exist."});
            }
        });
    });
}

module.exports.insertTeam = insertTeam;
module.exports.teamByID = teamByID;
module.exports.getAllTeams = getAllTeams;
module.exports.updateTeam = updateTeam;