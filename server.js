const express = require('express');
const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(express.static(__dirname + '/public'));

const users = {};

io.on('connection', (socket) => {
  socket.on('new-user', (name) => {
    console.log(socket.id);
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
  });

  socket.on('send-message', (message) => {
    socket.broadcast.emit('receive-message', {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(3030, () => {
  console.log('Server is running at 3030');
});
