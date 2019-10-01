// Open and connect output socket
function setup() {
  let socket = io('/output');
  socket.on('connect', () => {
    console.log('CONNECT');

    socket.on('sentence', (data) => {
      console.log("SENTENCE");
      document.body.innerHTML = `<p>${data.sentence}</p>` + document.body.innerHTML;
    });
  });
}