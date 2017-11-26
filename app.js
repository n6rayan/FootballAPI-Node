const express = require('express');
const bodyParser = require('body-parser');

const mysql = require('./database/databaseConnection');
const id = require('./uniqueID/createUniqueID');
const unixTime = require('./dateTime/dateTime');

const app = express();

var insertSQL = 'INSERT INTO club (club_id, club_name, location, league, manager, stadium, created_by, created_at, stadium_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
var selectSQL = 'SELECT * FROM club WHERE club_id=?';

app.use(bodyParser.json());
app.set('view engine', 'pug');

app.get('/', (req, res) => {

    res.render('index');
});

app.get('/api/team/:id', (req, res) => {

    mysql.query(selectSQL, req.params.id, (err, result) => {

        if (err) {

            res.send({
                "success":0,
                "message":"Cannot find a team based off that ID."
            });
        }
        else {

            res.send(result)
        }
    });
});

app.post('/api/insertTeam', (req, res) => {

    var values = [

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

    mysql.query(insertSQL, values, (err, result) => {

        if (err) {
            res.send({
                "success":0,
                "message":"Something went wrong."
            });
            throw err;
        }
        else {

            res.setHeader('Content-Type', 'application/json');
            res.send({
                "success":1,
                "message":"You have successfully inserted a new team."
            });
        }
    });
});

app.listen(3000, function() {

    console.log('Server started on port 3000...' + 
        "\nGo to http://127.0.0.1:3000 in the browser to view...");
});