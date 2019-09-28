let players = {};
let adjectives;
let currentWord;
let halfWidth;
let rollover;
let textX, textY, textW, textH;
let offsetX, offsetY;
let dragging;
let i;

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
  i = 0;
  background(20);
  currentword = "";
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

function draw(){
  if(adjectives){
    currentword = adjectives[i];
    background(20);

    fill(255, 204, 0);
    rect(10, 10, halfWidth-10, halfheight);
    fill(105, 186, 73);
    rect(halfWidth+10, 10, halfWidth-20, halfheight);

    fill(200, 200, 200);

    if (dragging) {
      textX = mouseX + offsetX;
      textY = mouseY + offsetY;
    }else{
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

function mousePressed(){
  if (rollover) {
    dragging = true;
  }
  if (dragging){
    offsetX = textX-mouseX;
    offsetY = textY-mouseY;
  }
}

}

function mouseReleased() {
  //if it was dragging
  if (dragging){
    //if over yellow
    if (mouseX > 10 && mouseX < 10 + (halfWidth-10) && mouseY > 10 && mouseY < 10 + halfheight){
    console.log("Yellow is " + currentword);
    i ++;

    //if over green
    }else if(mouseX > halfWidth+10 && mouseX < halfWidth+10 + halfWidth-20 && mouseY > 10 && mouseY < 10 + halfheight){
    console.log("Green is " + currentword);
    i ++;
    }
    dragging = false;
  }
}
