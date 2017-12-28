const mysql = require('../database/databaseConnection');
const request = require('request');

const getStadiumAddress = (name, callback) => {

    const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + name + '&key=AIzaSyA2MX5dBMI-Ox-xg2bOwS1e0K9wsWGdZMA';

    request.get(url, (error, response, body) => {

        json = JSON.parse(body);
        callback(json.results[0].formatted_address)
    });
}

module.exports.getStadiumAddress = getStadiumAddress;