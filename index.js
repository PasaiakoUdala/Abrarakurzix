/**
 * Created by iibarguren on 3/7/17.
 */

var app = require("express");
var server = require("http").Server(app);
var io = require("socket.io")(server);
var port = 3700;

console.log(port + " portuan entzuten!!");

var bezeroak = [];

io.on('connection', function (socket) {
    console.log("Bezero berria");
    // Izena eman bezeroari
    socket.name = socket.conn.remoteAddress + ":" + socket.conn.remotePort;

    // Gehitu bezeroen zerrendara
    bezeroak.push(socket);

    socket.emit('message', {message: 'Kaixo ' + socket.name});


    var MySQLEvents = require('mysql-events');
    var dsn = {
        host: _dbhostname_,
        user: _dbusername_,
        password: _dbpassword_
    };
    var mysqlEventWatcher = MySQLEvents(dsn);
    var watcher = mysqlEventWatcher.add(
        'ivozng.ast_cdr',
        function (oldRow, newRow, event) {
            // search="src,dst,call_descr,call_type,calldate,src_empresa,src_departamento,dst_empresa,dst_departamento"
            //row insert
            if (oldRow === null) {
                console.log("Dei berria: " + newRow.fields.src + " => " + newRow.fields.dst );
                var deia = {};

                deia.src = newRow.fields.src;
                deia.dst = newRow.fields.dst;
                deia.call_descr = newRow.fields.call_descr;
                deia.call_type = newRow.fields.call_type;
                deia.calldate = newRow.fields.calldate;
                deia.src_empresa = newRow.fields.src_empresa;
                deia.src_departamento = newRow.fields.src_departamento;
                deia.dst_empresa = newRow.fields.dst_empresa;
                deia.dst_departamento = newRow.fields.dst_departamento;
                deia.disposition = newRow.fields.disposition;
                deia.duration = newRow.fields.duration;
                deia.hangupcause = newRow.fields.hangupcause;
                deia.origcid = newRow.fields.origcid;
                deia.srcagent = newRow.fields.srcagent;
                deia.billsec = newRow.fields.billsec;

                // Jatorria
                if (deia.srcagent !== null) {
                    deia.jatorria = newRow.fields.origcid;
                } else {
                    deia.jatorria = newRow.fields.src;
                }

                // Emaitza
                if ( newRow.fields.billsec === 0 ) {
                    if (( newRow.fields.hangupcause === null) || ( newRow.fields.hangupcause === 'NULL' )) {
                        deia.emaitza = 'Ez du erantzuten.';
                    } else {
                        deia.emaitza = newRow.fields.hangupcause;
                    }
                } else {
                    if ( newRow.fields.hangupcause !== '' ) {
                        deia.emaitza = newRow.hangupcause;
                    } else {
                        deia.emaitza = newRow.cdr_disposition;
                    }
                }


                socket.emit('deiBerria', deia);
            }

            //row deleted
            if (newRow === null) {
                console.log("deleteeeeeeeeeed!");
                socket.emit("deiDelete", newRow);
            }

            //row updated
            if (oldRow !== null && newRow !== null) {
                //update code goes here
                console.log("**********************************************************");
                socket.emit("updateLast", oldRow);
                socket.emit("updateNew", newRow);

                // console.log(oldRow);
                // console.log(newRow);
                console.log("update");
                console.log("**********************************************************");
            }

            //detailed event information
            // console.log(event)
        }
    );


});
io.on('connect_failed', function () {
    console.log("Sorry, there seems to be an issue with the connection!");
});
io.on('error', function () {
    console.log("eror!");
});
var config = require("./config/config.js");
var _dbhostname_ = config.MYSQL.server;
var _dbusername_ = config.MYSQL.user;
var _dbpassword_ = config.MYSQL.passwd;



server.listen(port);