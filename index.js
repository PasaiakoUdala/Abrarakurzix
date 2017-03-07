/**
 * Created by iibarguren on 3/7/17.
 */

var express = require("express");
var app = express();
var port = 3700;

app.get("/", function(req, res){
    res.send("It works!");
});

var io = require('socket.io').listen(app.listen(port));
console.log("Listening on port " + port);

var bezeroak = [];

io.sockets.on('connection', function (socket) {

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

console.log(_dbhostname_);
console.log(_dbusername_);
console.log(_dbpassword_);

var MySQLEvents = require('mysql-events');
var dsn = {
    host:     _dbhostname_,
    user:     _dbusername_,
    password: _dbpassword_,
};
var mysqlEventWatcher = MySQLEvents(dsn);
var watcher =mysqlEventWatcher.add(
    'ivozng.ast_adr',
    function (oldRow, newRow, event) {

        //row inserted
        if (oldRow === null) {
            //insert code goes here
            console.log("**********************************************************");
            console.log(newRow);
            console.log("**********************************************************");
        }

        //row deleted
        if (newRow === null) {
            //delete code goes here
        }

        //row updated
        if (oldRow !== null && newRow !== null) {
            //update code goes here
        }

        //detailed event information
        //console.log(event)
    },
    'match this string or regex'
);