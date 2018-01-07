const mysql = require('../database/databaseConnection');
const request = require('request');

const insertStadiumSQL = 'INSERT INTO stadium SET ?';
const selectSQL = 'SELECT * FROM stadium WHERE stadium_name=?';
const deleteSQL = 'DELETE FROM stadium WHERE stadium_id=?';

const selectStadiumSQL = 'SELECT stadium.stadium_id, club.club_name, stadium.stadium_name, stadium.stadium_address FROM stadium INNER JOIN club ON stadium.club_id=club.club_id';

function stadiumByName(name, callback) {

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

const stadiumByID = (id, use, callback) => {

    mysql.query(selectStadiumSQL + ' AND stadium.stadium_id=?', id, (err, result) => {

        if (err) throw err;

        if (result.length > 0) {
            if (use) callback(result);
            if (!use) callback(true);
        }
        else {
            if (use) callback({"isSuccess": 0, "message": "Can't find a stadium based off that ID."});
            if (!use) callback(false);
        }
    });
}

const getAllStadiums = (callback) => {

    mysql.query(selectStadiumSQL, (err, result) => {

        if (err) throw err;

        if (result.length > 0) {
            callback(result);
        }
    });
}

const getStadiumAddress = (name, callback) => {

    const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + name + '&key=AIzaSyA2MX5dBMI-Ox-xg2bOwS1e0K9wsWGdZMA';

    request.get(url, (error, response, body) => {

        json = JSON.parse(body);
        callback(json.results[0].formatted_address)
    });
}

const insertStadium = stadiumData => {

    stadiumByName(stadiumData.stadium_name, stadiumExists => {

        if (!stadiumExists) {
            mysql.query(insertStadiumSQL, stadiumData, (err, result) => {

                if (err) throw err;
            });
        }
    });
}

const deleteStadium = (id, callback) => {

    stadiumByID(id, 0, stadiumExists => {

        if (stadiumExists) {
            mysql.query(deleteSQL, id, (err, result) => {

                callback({"isSuccess": 1, "message": "Stadium with ID of " + id + " has been deleted."});
            });
        }
        else {
            callback({"isSuccess": 0, "message": "A stadium with that ID does not exist."});
        }
    });
}

module.exports.insertStadium = insertStadium;
module.exports.getStadiumAddress = getStadiumAddress;
module.exports.stadiumByID = stadiumByID;
module.exports.getAllStadiums = getAllStadiums;
module.exports.deleteStadium = deleteStadium;