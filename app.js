const express = require('express');
const bodyParser = require('body-parser');

const mysql = require('./database/databaseConnection');
const id = require('./uniqueID/createUniqueID');
const unixTime = require('./dateTime/dateTime');
const existingTeam = require('./teamManager/teamManager');
const stadiumAddress = require('./stadiumManager/stadiumManager.js');

const app = express();

var insertClubSQL = 'INSERT INTO club (club_id, club_name, location, league, manager, stadium, created_by, created_at, stadium_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
var insertStadiumSQL = 'INSERT INTO stadium (stadium_id, stadium_name, stadium_address) VALUES (?, ?, ?)';
var selectSQL = 'SELECT * FROM club WHERE club_id=?';

app.use(bodyParser.json());
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/api/team/:id', (req, res) => {

    mysql.query(selectSQL, req.params.id, (err, result) => {

        if (err) throw err;

        if (result.length > 0) {
            res.send(result)
        }
        else {
            res.send({"isSuccess": 0, "message": "Can't find a team based off that ID."})
        }
    });
});

app.post('/api/insertTeam', (req, res) => {

    var clubData = [
        id.uniqueID(req.body.club_name),
        req.body.club_name,
        req.body.location,
        req.body.league,
        req.body.manager,
        req.body.stadium,
        req.body.created_by,
        unixTime.epoch(),
        id.uniqueID(req.body.stadium)
    ];

    const stadium = req.body.stadium + ', ' + req.body.location;

    stadiumAddress.getStadiumAddress(stadium, address => {
        var stadiumData = [
            id.uniqueID(req.body.stadium),
            req.body.stadium,
            address
        ];

        mysql.query(insertStadiumSQL, stadiumData, (err, result) => {
            if (err) throw err;
        });
    });

    existingTeam.teamByID(req.body.club_name, teamExists => {

        if (!teamExists) {
            mysql.query(insertClubSQL, clubData, (err, result) => {

                if (err) throw err;
                res.send({"isSuccess": 1, "message": "You have successfully inserted a new team."});
            });
        }
        else {
            res.send({"isSuccess": 0, "message": "A team with that name already exists."})
        }
    });

});

app.listen(3000, function() {

    console.log('Server started on port 3000...' + 
        "\nGo to http://127.0.0.1:3000 in the browser to view...");
});