//tetetetetetetete

const express = require('express');
const { use } = require('express/lib/application');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var userArray = [];
var index = 0;

app.use(express.static('public'));

server.listen(process.env.PORT||3000, () => {
  console.log('listening on *:3000');
  console.log('Link: http://localhost:3000');
});

//Connect and Disconnetct User from Server
//Fügt id in Array aus und sendet Id zurück an Tab
io.on('connection', (socket) => {
  var id = socket.id;
  userArray[index] = id;
  index++;
  reorgArray();
  io.emit('user', id);
  io.emit('userArray', userArray);
 
  // Löscht user der disconnected
  socket.on('disconnect', () => {
    for(let i = 0; i < userArray.length; i++) {
      if (socket.id == userArray[i]) {
        userArray.splice(i, 1);
      }
    }
    reorgArray();
    io.emit('userArray', userArray);
  });
});

// Reorganisiert das Array, löscht Lücken
function reorgArray() {
  let tempArray = [];
  let y = 0;
  for(let x = 0; x < userArray.length; x++) {
      if (userArray[x] !== undefined) {
        tempArray[y] = userArray[x];
        y++;
      }
  }
  userArray = tempArray;
}

// Aktualisiert beim Mitspieler den Score falls der Ball ins eigene Tor geflogen ist
io.on('connection', (socket) => {
  socket.on('score', (newScore) => {
    io.emit('score', newScore);
  });
  socket.on('scoreid', (scoreId) => {
    io.emit('scoreid', scoreId);
  });
});

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

io.on('connection', (socket) => {
    socket.on('ballData', (userId, ballId, x, xSpeed, ySpeed) => {
      ySpeed *= -1;
      let randomUser = userArray[getRandomInt(userArray.length)];
      io.to(randomUser).emit('ready', 0);
        while(userId === randomUser && userArray.length >= 2) {
          randomUser = userArray[getRandomInt(userArray.length)];
        }
      io.to(randomUser).emit('ballData', ballId, x, xSpeed, ySpeed);
  });
});
