const mysql = require('../database/databaseConnection');
const request = require('request');

const insertStadiumSQL = 'INSERT INTO stadium SET ?';
const selectSQL = 'SELECT * FROM stadium WHERE stadium_name=?';

const selectStadiumSQL = 'SELECT stadium.stadium_id, club.club_name, stadium.stadium_name, stadium.stadium_address FROM stadium INNER JOIN club ON stadium.club_id=club.club_id AND stadium.stadium_id=?';

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

const stadiumByID = (id, callback) => {

    mysql.query(selectStadiumSQL, id, (err, result) => {

        if (err) throw err;

        if (result.length > 0) {
            callback(result);
        }
        else {
            callback({"isSuccess": 0, "message": "Can't find a stadium based off that ID."});
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

    stadiumByID(stadiumData.stadium_name, stadiumExists => {

        if (!stadiumExists) {
            mysql.query(insertStadiumSQL, stadiumData, (err, result) => {

                if (err) throw err;
            });
        }
    });
}

module.exports.insertStadium = insertStadium;
module.exports.getStadiumAddress = getStadiumAddress;
module.exports.stadiumByID = stadiumByID;