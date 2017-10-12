var express = require('express');
moment = require('moment')

var PORT = process.env.PORT || 3000;
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  console.log('You are connecting to server socket!')

  socket.on('message', (message) => {
    console.log('Message receive: ' + message.text);
    message.timestamp = moment().valueOf();
    io.emit('message', message);
  });

  socket.emit('message', {
    text: "Welcome to the app chat!",
    timestamp: moment().valueOf()
  });
});

http.listen(PORT, () => {
  console.log('YOur server is started!')
});