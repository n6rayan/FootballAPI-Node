const mysql = require('mysql');
const fs = require('fs');

const info = JSON.parse(fs.readFileSync('./database/sqlConfig.json', 'UTF-8'));

const host = info.devEnvironment ? info.databaseCredentials.devCredentials.host : info.databaseCredentials.prodCredentials.host;
const user = info.devEnvironment ? info.databaseCredentials.devCredentials.user : info.databaseCredentials.prodCredentials.user;
const password = info.devEnvironment ? info.databaseCredentials.devCredentials.password : info.databaseCredentials.prodCredentials.password;
const port = info.devEnvironment ? info.databaseCredentials.devCredentials.port : info.databaseCredentials.prodCredentials.port;
const database = info.devEnvironment ? info.databaseCredentials.devCredentials.database : info.databaseCredentials.prodCredentials.database;

const connection = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    port: port,
    database: database
});

connection.connect(function (err) {

    if (err) throw err;

    var dbString;

    info.devEnvironment ? dbString = 'Connected to development DB @ ' : dbString = 'Connected to production DB @ ';
    console.log(dbString + Date());
});

module.exports = connection;