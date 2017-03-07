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