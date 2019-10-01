let players = {};
let adjectives;
let currentWord;
let halfWidth;
let rollover;
let textX, textY, textW, textH;
let offsetX, offsetY;
let dragging;
let wordIndex = 0;
let video;

let playerLeft;
let playerRight;

let name;

function setup() {
  const socket = io('/input');

  // Listen for confirmation of connection
  socket.on('connect', () => initSocket(socket));

  createCanvas(windowWidth, windowHeight);
  textSize(16);
  noStroke();
  textAlign(CENTER);
  halfWidth = windowWidth/2;
  halfheight = halfWidth*0.7;
  textX = halfWidth-60;
  textY = halfheight+50;
  textW = 120;
  textH = 30;
  offsetX = 0;
  offsetY = 0;
  dragging = false;
  background(20);
  currentword = "";
  // video = initVideo(socket);
}

function initSocket(socket) {
  name = window.prompt("name?");
  console.log(name);
  socket.emit('init-player', { name: name });
  socket.on('update-players', (data) => {
    players = data.players;
  });

  socket.on('adjectives', (data) => {
    adjectives = data.adjectives[socket.id];
    const keys = Object.keys(players);
    let notMe = [];
    for (let i = 0; i < keys.length; i++) {
      if (name != keys[i]) {
        notMe.push(keys[i]);
      }
    }

    playerLeft = notMe[0];
    playerRight = notMe[1];
  });

  socket.on('from-server', (message) => {
    console.log(message);
  });
}

function draw() {
  if(adjectives) {
    currentword = adjectives[wordIndex];
    background(20);

    fill(255, 204, 0);
    rect(10, 10, halfWidth-10, halfheight);
    fill(105, 186, 73);
    rect(halfWidth+10, 10, halfWidth-20, halfheight);

    fill(200, 200, 200);

    if (dragging) {
      textX = mouseX + offsetX;
      textY = mouseY + offsetY;
    } else {
      textX = halfWidth-50;
      textY = halfheight+50;
    }

    rect(textX, textY, textW, textH);

    fill(20,20,20);
    text(currentword, textX+60, textY+20);

    if (mouseX > textX && mouseX < textX + textW && mouseY > textY && mouseY < textY + textH) {
      rollover = true;
    }
    else {
      rollover = false;
    }
  }
}

function mousePressed() {
  if (rollover) {
    dragging = true;
  }
  if (dragging) {
    offsetX = textX-mouseX;
    offsetY = textY-mouseY;
  }
}

function mouseReleased() {
  // if it was dragging
  if (dragging) {
    // if over yellow
    if (mouseX > 10 && mouseX < 10 + (halfWidth-10) && mouseY > 10 && mouseY < 10 + halfheight){
      console.log(playerLeft);
      console.log(players[playerLeft]);
      console.log("Yellow is " + currentword);
      wordIndex++;
    // if over green
    } else if(mouseX > halfWidth+10 && mouseX < halfWidth+10 + halfWidth-20 && mouseY > 10 && mouseY < 10 + halfheight){
      console.log(playerRight);
      console.log(players[playerRight]);
      console.log("Green is " + currentword);
      wordIndex++;
    }
    dragging = false;
  }
}

async function initVideo(socket) {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  console.log(stream);
  const videoElement = document.createElement('video');
  videoElement.srcObject = stream;
  videoElement.play();
  document.body.appendChild(videoElement);

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  console.log(videoElement.videoWidth);
  window.setInterval(() => {
    console.log("SEND");
    context.drawImage(videoElement, 0, 0, videoElement.videoWidth, videoElement.videoHeight);
    console.log(canvas);
    socket.emit('to-inputs', {id: socket.id, image: canvas.toDataURL('image/jpeg') });
  }, 1000);
  return videoElement;
}