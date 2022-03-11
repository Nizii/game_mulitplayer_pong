

var socket = io();
var id;
var newScore;

// Random Ball Placement
var xBall = Math.floor(Math.random() * 300) + 50;
var yBall = 50;
var xSpeed = (5, 4);
var ySpeed = (-4, 5);
var myScore = 0;
var scoreEnemy = 0;

// Canvas
function setup() {
	createCanvas(400, 400);
	getID();
	cursor(ARROW);
	rectMode(CENTER);
	noStroke();
}

//Background

function draw() {
	
	// Background
	background(0, 60);
	
	// Paddle
	fill('#ffffff');
	rect(mouseX, 375, 80, 15);
	
	//Functions
	move();
	display();
	bounce();
	//resetBall();
	paddle();
	
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


function bounce() {
	if (xBall < 10 ||
		xBall > 400 - 10) {
			xSpeed *= -1;
		}
		if (yBall < 10 ) {
			socket.emit("trigger", 0);
			console.log("trigger");
			ySpeed *= -1;
		}
		
		if (yBall > 400 - 10) {
			ySpeed *= -1;
			scoreEnemy++;
			socket.emit('score', scoreEnemy);
			socket.emit('scoreid', id);
		}
	}
	
	socket.on('scoreid', function(scoreId) {
		if (scoreId != id) {
			myScore = newScore;
			// alternative:
			// myScore++;
		}
	});
	
	
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
		if ((xBall > mouseX - 40 && xBall < mouseX + 40) 
		&& (yBall + 10 >= 375)) {
			ySpeed *= -1;
		}
	}
	
	function getID(){
		socket.once('user', function(msg) {
			id = msg;
			
			let h5 = createElement('h5', msg);
			h5.style('color', '#00a1d3');
			h5.position(10, 400);
		});
	}
	