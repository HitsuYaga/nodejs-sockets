var express = require('express');

var PORT = process.env.PORT || 3000;
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  console.log('You are connecting to server socket!')

  socket.on('message', (message) => {
    console.log('Message receive: ' + message.text);
    io.emit('message', message);
  });

  socket.emit('message', {
    text: "Welcome to the app chat!"
  });
});

http.listen(PORT, () => {
  console.log('YOur server is started!')
});