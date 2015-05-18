var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = process.env.PORT || 4000;
var io = require('socket.io').listen(http);
var setSocketListeners = require('./socketConnection/socketConnection')(io);
var checkApplicants = require('./checkApplicants');

app.use('/', express.static(__dirname + '/client'));

http.listen(port);
console.log('Server started on port', port);

setInterval(function() {
  console.log('server still running:', new Date().toString());
}, 60000);