// Open and connect output socket
let socket = io('/output');

socket.on('sentence', (data) => {
  document.body.innerHTML = `<p>${data.sentence}</p>` + document.body.innerHTML;
});