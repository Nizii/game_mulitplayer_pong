const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const userArray = [100];
var index = 0;

// Verzeichnis
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/libraries/p5.min.js", (req, res) => {
  res.sendFile(__dirname + "/libraries/p5.min.js");
});
app.get("/libraries/p5.sound.min.js", (req, res) => {
  res.sendFile(__dirname + "/libraries/p5.sound.min.js");
});
app.get("/style.css", (req, res) => {
  res.sendFile(__dirname + "/style.css");
});
app.get("/client.js", (req, res) => {
  res.sendFile(__dirname + "/client.js");
});

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
  console.log("Anzahl Spieler " + index);
  io.emit('user', socket.id);
  for(let i = 0; i < userArray.length;i++) {
    console.log(userArray[i]);
  };
 
  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('user', "is offline");
  });
});

// Aktualisiert beim Mitspieler den Score falls der Ball ins eigene Tor geflogen ist
io.on('connection', (socket) => {
  socket.on('score', (newScore) => {
    io.emit('score', newScore);
  });
  socket.on('scoreid', (scoreId) => {
    io.emit('scoreid', scoreId);
  });
});

// Ordnet zu in welchem Screen gerade der Ball ist
io.on('connection', (socket) => {
  socket.on('triggerid', (triggerid) => {
    io.emit('triggerid', triggerid);
  });
});


io.on('connection', (socket) => {
  // übermittelt Ball X Position
  socket.on('getX', (xBall) => {
    io.emit('getX', xBall);
  });
  // übermittelt Ball Y Speed
  socket.on('getYSpeed', (ySpeed) => {
    io.emit('getYSpeed', ySpeed);
  });
  // übermittelt Ball X Speed
  socket.on('getXSpeed', (xSpeed) => {
    io.emit('getXSpeed', xSpeed);
  });
});


io.on('connection', (socket) => {
  socket.on('output', (output) => {
    console.log(output);
  });

});

