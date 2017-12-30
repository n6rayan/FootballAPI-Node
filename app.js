const express = require('express');
const bodyParser = require('body-parser');

const mysql = require('./database/databaseConnection');
const id = require('./uniqueID/createUniqueID');
const unixTime = require('./dateTime/dateTime');
const team = require('./teamManager/teamManager');
const stadium = require('./stadiumManager/stadiumManager');

const app = express();

app.use(bodyParser.json());
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/clubs', (req, res) => {

    team.getAllTeams(data => {

        res.render('clubs', {clubs: data});
    });
});

app.get('/stadiums', (req, res) => {

    stadium.getAllStadiums(data => {

        res.render('stadiums', {stadiums: data});
    });
});

app.get('/api/team/:id', (req, res) => {

    team.teamByID(req.params.id, response => {

        res.send(response);
    });
});

app.get('/api/stadium/:id', (req, res) => {

    stadium.stadiumByID(req.params.id, response => {

        res.send(response);
    });
});

app.post('/api/insertTeam', (req, res) => {

    const clubData = {
        club_id: id.uniqueID(req.body.club_name),
        club_name: req.body.club_name,
        location: req.body.location,
        league: req.body.league,
        manager: req.body.manager,
        stadium: req.body.stadium,
        created_by: req.body.created_by,
        created_at: unixTime.epoch()
    };

    stadium.getStadiumAddress(clubData.stadium + ', ' + clubData.location, stadiumAddress => {

        const stadiumData = {
            stadium_id: id.uniqueID(req.body.stadium),
            stadium_name: req.body.stadium,
            stadium_address: stadiumAddress,
            club_id: clubData.club_id
        };

        stadium.insertStadium(stadiumData);
    });

    team.insertTeam(clubData, response => {

        res.send(response);
    });

});

app.listen(3000, function() {

    console.log('Server started on port 3000...\nGo to http://127.0.0.1:3000 in the browser to view...');
});