

var socket = io();
var id;
var newScore;
var isplaying = false;
var ball;

// Random Ball Placement
var canvasWidth = 900;
var xBallRndStart = Math.floor(Math.random() * canvasWidth/2) + canvasWidth/4;
var xBall = xBallRndStart;
var yBall = 50;
var xSpeed = 0;
var ySpeed = 3;
var myScore = 0;
var scoreEnemy = 0;

// Canvas
function setup() {
	createCanvas(canvasWidth, 700);
	getID();
	cursor('ew-resize');
	rectMode(CENTER);
	noStroke();

	button = createButton("Start");
	button.mouseClicked(startGame);
	button.size(50,25);
	button.position(10,625);
	button.style("font-family", "Bodoni");
	button.style("font-size", "12px");
}

// Alternative Start
function keyPressed() {
	if (keyCode === 32) {
	  startGame();
	}
  }

  
// Background
function draw() {
	
	// Background
	background(0, 60);
	
	// Paddle
	fill("#fff");
	rect(mouseX, 600, 80, 15);
	
	// Functionslo
	if (isplaying){
		console.log(isplaying);
		display();
		move();
		bounce();
		paddle();
	}
	

	//Score
	fill('#d9c3f7');
	textSize(24);
	text(myScore + '-' + scoreEnemy, 10, 25);
}

// Ball Functions
function move() {
	xBall += xSpeed;
	yBall += ySpeed;
}

function startGame(){
	isplaying = true;
}

// Seitenabpraller
function bounce() {

	// Links/Rechts
	if (xBall < 10 || xBall > canvasWidth - 10) {
			xSpeed *= -1;
		}

	// Top
	if (yBall < 10 ) {
		// uncomment below to make multiplayer
		socket.emit("triggerid", id);
		ySpeed *= -1;
	}
		
	// Bottom
	if (yBall > 700 - 10) {
		ySpeed *= -1;
		scoreEnemy++;
		socket.emit('score', scoreEnemy);
		socket.emit('scoreid', id);

		// Automatic ball reset
/* 		yBall = 50;
		xBallRndStart = xBallRndStart = Math.floor(Math.random() * window.innerWidth/2) + window.innerWidth/4;
		xBall = xBallRndStart;
		xSpeed = 0;
		ySpeed = 3; */
	}
}

	socket.on("triggerid", function(triggerid){
		console.log(id +" " + triggerid);
		if (triggerid != id) {
			isplaying = true;
		} else {
			isplaying = false;
		}
	});
	
	socket.on('scoreid', function(scoreId) {
		if (scoreId != id) {
			myScore = newScore;
			// alternative:
			// myScore++;
		}
	});
	
	
	function display() {
		fill('#00FF00');
		e = ellipse(xBall, yBall, 20, 20);
	}
	
	// Bounce off Paddle
	function paddle() {
		if (isplaying == true) {	
			if ((xBall > mouseX - 40 && xBall < mouseX + 40) && (yBall + 10 >= 600)) {
				ySpeed = ySpeed + 0.5;
				ySpeed *= -1;

				// Dynamic bounce direction
				var d = mouseX - xBall;
				xSpeed += d * -0.1;
				console.log(ySpeed);
			}
			
		}
	}
	
	function getID(){
		socket.once('user', function(msg) {
			id = msg;
			let h5 = createElement('h5', msg);
			h5.style('color', '#00a1d3');
			h5.position(10, 650);
		});
	}
	