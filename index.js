/**
 * Created by iibarguren on 3/7/17.
 */

var express = require("express");
var app = express();
var port = 3700;
var server = require('http').createServer(app);
var io = require('socket.io')(server);

server.listen(port);
console.log("Listening on port " + port);

var bezeroak = [];

io.on('connection', function (socket) {
    console.log("Bezero berria");
    // Izena eman bezeroari
    socker.name = socket.remoteAddress + ":" + socket.remotePort;

    // Gehitu bezeroen zerrendara
    bezeroak.push(socket);

    socket.emit('message', { message: 'Kaixo ' + socket.name });

});

var config = require("./config/config.js");
var _dbhostname_ = config.MYSQL.server;
var _dbusername_ = config.MYSQL.user;
var _dbpassword_ = config.MYSQL.passwd;

var MySQLEvents = require('mysql-events');
var dsn = {
    host:     _dbhostname_,
    user:     _dbusername_,
    password: _dbpassword_,
};
var mysqlEventWatcher = MySQLEvents(dsn);
var watcher =mysqlEventWatcher.add(
    'ivozng.ast_cdr',
    function (oldRow, newRow, event) {

        //row insert
        if (oldRow === null) {
            console.log(newRow);
        }

        //row deleted
        if (newRow === null) {

        }

        //row updated
        if (oldRow !== null && newRow !== null) {
            //update code goes here
            console.log("**********************************************************");
            console.log(oldRow);
            console.log(newRow);
            console.log("**********************************************************");
        }

        //detailed event information
        console.log(event)
    }
);