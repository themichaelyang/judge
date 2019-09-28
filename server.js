const port = process.env.PORT || 8000;
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

let state = '1_WAITING_PLAYERS';
let players = {};

app.use(express.static('public'));
server.listen(port, () => {
  console.log('Server listening at port: ', port);
});

const inputs = io.of('/input');
inputs.on('connection', initInput);

function initInput(socket) {
  console.log('An input client connected: ' + socket.id);
  socket.on('init-player', (message) => {
    if (state == '1_WAITING_PLAYERS') {
      console.log(message);
      players[socket.id] = message.name;
      socket.emit('update-players', { players: players });

      if (Object.keys(players).length == 3) {
        // start!!
      }
    }
  });

  socket.on('disconnect', () => removePlayer(socket));

  socket.on('to-inputs', (message) => {
    socket.to('/input').emit('from-server', message);
  });
  socket.on('to-everyone', (message) => {
    socket.broadcast.emit('from-server', message);
  });
  socket.on('to-everyone', (message) => {
    socket.to('/output').emit('from-server', message);
  });
}

function removePlayer(socket) {
  if (socket.id in players) {
    delete players[socket.id];
  }
}
