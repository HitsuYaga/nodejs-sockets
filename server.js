var express = require('express');
moment = require('moment')

var PORT = process.env.PORT || 3000;
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var clientInfo = {}

var sendCurrentUsers = (socket) => {
  var info = clientInfo[socket.id];
  var users = [];

  if (typeof info === 'undefined') {
    return;
  }

  Object.keys(clientInfo).forEach((socketId) => {
    var userInfo = clientInfo[socketId];

    if (info.room === userInfo.room) {
      users.push(userInfo.name);
    }
  });

  socket.emit('message', {
    name: 'System',
    text: 'Current users: ' + users.join(', '),
    timestamp: moment().valueOf()
  })
}

io.on('connection', (socket) => {
  console.log('You are connecting to server socket!')

  socket.on('disconnect', () => {
    var userData = clientInfo[socket.id];

    if (typeof userData !== 'undefined') {
      socket.leave(userData.room);
      io.to(userData.room).emit('message', {
        name: 'System',
        text: userData.name + ' has left',
        timestamp: moment().valueOf()
      });
      delete clientInfo[socket.id];
    }
  })

  socket.on('joinRoom', (req) => {
    clientInfo[socket.id] = req;
    socket.join(req.room);
    socket.broadcast.to(req.room).emit('message', {
      name: 'System',
      text: req.name + ' has join!',
      timestamp: moment().valueOf()
    })
  })

  socket.on('message', (message) => {
    console.log('Message receive: ' + message.text);

    if (message.text === '@currentUsers') {
      sendCurrentUsers(socket);
    } else {
      message.timestamp = moment().valueOf();
      io.to(clientInfo[socket.id].room).emit('message', message);
    }
  });

  socket.emit('message', {
    name: 'System',
    text: "Welcome to the app chat!",
    timestamp: moment().valueOf()
  });
});

http.listen(PORT, () => {
  console.log('YOur server is started!')
});