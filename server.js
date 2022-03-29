const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var playerArray = [];
var playerArrayIndex = 0;
var startTime = 120;
var remain = startTime;
var timer;

app.use(express.static('public'));

server.listen(process.env.PORT||3000, () => {
  console.log('listening on *:3000');
  console.log('Link: http://localhost:3000');
});

/*
  ################################################################################################################
  Io.on's
  ################################################################################################################
*/

// Handled den Timer
io.on('connection', (socket) => {
  timerIsRunning = false;
  socket.once("timer", () => {
    timerIsRunning = true;
    configTimer();
  });
});

// Neuer Spieler tritt ein
io.on('connection', (socket) => {
  setUserIdForNewJoinedUser(socket);
  resetScore();
  resetBalls();
  remain = startTime;
});

io.on('connection', (socket) => {
  socket.on('ballData', (userId, ball) => {
      ball.ySpeed *= -1;
      let randomUserId = playerArray[getRandomInt(playerArray.length)].id;
        while(userId === randomUserId && playerArray.length >= 2) {
          randomUserId = playerArray[getRandomInt(playerArray.length)].id;
        }
      io.to(randomUserId).emit('ballData', ball);
  });
});

io.on('connection', (socket) => {
  socket.on('lobby', (playerObject) => {
    playerArray[playerArrayIndex] = playerObject;
    playerArrayIndex++;
    playerArray = reorgArray(playerArray);
    playerArrayIndex = playerArray.length;
    updateLobbyData();
  });

  socket.on('disconnect', () => {
    for(let i = 0; i < playerArray.length; i++) {  
      for (const value of Object.values(playerArray[i])) {
        if (socket.id === value) {
          playerArray.splice(i, 1);
        }
      }
    }
    playerArray = reorgArray(playerArray);
    updateLobbyData();
  });
});

io.on('connection', (socket) => {
  socket.on('updateScore', (playerObject) => {
    for(let i = 0; i < playerArray.length; i++) {
      if (playerArray[i].id === playerObject.id) {
        playerArray[i] = playerObject;
      } 
    }
    updateLobbyData();
  });
});

/*
  ################################################################################################################
  io.emit's
  ################################################################################################################
*/

function resetScore() {
  for(let i = 0; i < playerArray.length; i++) {
    playerArray[i].score = 0;
  }
  io.emit("lobby", playerArray);
}

function resetBalls() {
  io.emit("resetBalls");
}

function startGameOverScreen() {
  io.emit("gameOver", playerArray);
}

function addBallsToTheGame() {
  io.emit('addBall', remain);
}

function updateTimerDisplay() {
  io.emit('timer', remain);
}

function updateLobbyData() {
  io.emit('lobby', playerArray);
}

function setUserIdForNewJoinedUser(socket) {
  io.emit('user', socket.id);
}

/*
  ################################################################################################################
  Functions
  ################################################################################################################
*/

function configTimer() {
  clearInterval(timer);
  timer = setInterval(function() {
    remain = remain - 1;
    if (timerIsRunning) {
      updateTimerDisplay();
      addBallsToTheGame();
      if (remain < 1) {
        clearInterval(timer);
        startGameOverScreen();
      }
    }}, 1200);
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