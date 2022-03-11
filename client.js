

var socket = io();

// Random Ball Placement
var xBall = Math.floor(Math.random() * 300) + 50;
var yBall = 50;
var xSpeed = (2, 7);
var ySpeed = (-7, -2);
var score = 0

// Canvas
function setup() {
  createCanvas(400, 400);
  getID();
}

//Background

function draw() {

  // Background
  background(0);

  // Paddle
  fill('#ffffff');
  rect(mouseX, 375, 90, 15);

  //Functions
  move();
  display();
  bounce();
  //resetBall();
  paddle();

  //Score
  fill('#d9c3f7');
  textSize(24);
  text("Score: " + score, 10, 25);
}
// Ball Functions
function move() {
  xBall += xSpeed;
  yBall += ySpeed;
}


function bounce() {

  if (xBall < 10 ||
    xBall > 400 - 10) {
    xSpeed *= -1;
  }
  if (yBall < 10 ) {
    socket.emit("trigger", 0);
    console.log("trigger");
  }
  
  if (yBall > 400 - 10) {
    ySpeed *= -1;
  }
}


// Reset Ball
//function resetBall() {
//  if (yBall >= 400 ||
//    yBall > 400 - 10) {
//    ySpeed = 4;
// }

//}

function display() {
  fill('#d9c3f7');
  ellipse(xBall, yBall, 20, 20);
}

// Bounce off Paddle
function paddle() {
  if ((xBall > mouseX &&
      xBall < mouseX + 90) &&
    (yBall + 10 >= 375)) {
    xSpeed *= -1;
    ySpeed *= -1;
    score++;

  }
}

function getID(){
  socket.once('user', function(msg) {
    let h5 = createElement('h5', msg);
    h5.style('color', '#00a1d3');
    h5.position(200, 0);
  });
}
