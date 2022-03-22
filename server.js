const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var playerObjectArray = [];
var playerArrayIndex = 0;
var startTime = 120;
var remain = startTime;
var timer;

app.use(express.static('public'));

server.listen(process.env.PORT||3000, () => {
  console.log('listening on *:3000');
  console.log('Link: http://localhost:3000');
});

io.on('connection', (socket) => {
  socket.once("timer", () => {
    configTimer();
  });
});

//Neuer Spieler tritt ein
io.on('connection', (socket) => {
  io.emit('user', socket.id);
  configTimer();
  resetScore();
  remain = startTime;
});

io.on('connection', (socket) => {
    socket.on('ballData', (userId, ballId, x, xSpeed, ySpeed, ballType, color) => {
      ySpeed *= -1;
      let randomUserId = playerObjectArray[getRandomInt(playerObjectArray.length)].id;
        while(userId === randomUserId && playerObjectArray.length >= 2) {
          randomUserId = playerObjectArray[getRandomInt(playerObjectArray.length)].id;
        }
      io.to(randomUserId).emit('ballData', ballId, x, xSpeed, ySpeed, ballType, color);
  });
});

io.on('connection', (socket) => {
  socket.on('lobby', (playerObject) => {
    playerObjectArray[playerArrayIndex] = playerObject;
    playerArrayIndex++;
    playerObjectArray = reorgArray(playerObjectArray);
    playerArrayIndex = playerObjectArray.length;
    io.emit("lobby", playerObjectArray);
  });

  socket.on('disconnect', () => {
    for(let i = 0; i < playerObjectArray.length; i++) {  
      for (const value of Object.values(playerObjectArray[i])) {
        if (socket.id === value) {
          playerObjectArray.splice(i, 1);
        }
      }
    }
    playerObjectArray = reorgArray(playerObjectArray);
    io.emit('lobby', playerObjectArray);
  });
});

io.on('connection', (socket) => {
  socket.on('updateScore', (playerObject) => {
    for(let i = 0; i < playerObjectArray.length; i++) {
      if (playerObjectArray[i].id === playerObject.id) {
        playerObjectArray[i] = playerObject;
      } 
    }
    io.emit("lobby", playerObjectArray);
  });
});

function configTimer() {
  clearInterval(timer);
  timer = setInterval(function() {
    remain = remain - 1;
    io.emit('timer', remain);
    io.emit('addBall', remain);
    if (remain < 1) {
      clearInterval(timer);
      io.emit("gameOver", remain);
    }
  }, 1200);
}

// Reorganisiert das Array, löscht Lücken
function reorgArray(inputArray) {
  let tempArray = [];
  let y = 0;
  for(let x = 0; x < inputArray.length; x++) {
      if (inputArray[x] !== undefined) {
        tempArray[y] = inputArray[x];
        y++;
      }
  }
  return tempArray;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function resetScore() {
  for(let i = 0; i < playerObjectArray.length; i++) {
    playerObjectArray[i].score = 0;
  }
  io.emit("lobby", playerObjectArray);
}