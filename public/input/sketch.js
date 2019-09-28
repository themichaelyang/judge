let players = {};
let adjectives;

const ADD_PLAYER = 'add-player';

function setup() {
  const socket = io('/input');

  // Listen for confirmation of connection
  socket.on('connect', () => initSocket(socket));
  createCanvas(windowWidth, windowHeight);
  background(255);
}

function initSocket(socket) {
  const name = window.prompt("name?");
  console.log(name);
  socket.emit('init-player', { name: name });
  socket.on('update-players', (data) => {
    players = data.players;
  });
  socket.on('adjectives', (data) => {
    adjectives = data.adjectives[socket.id];
  });
}