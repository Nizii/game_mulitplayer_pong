

var socket = io();
var id;
var newScore;
var isplaying = false;
var ball;

// Random Ball Placement
var xBall = Math.floor(Math.random() * 300) + 50;
var yBall = 50;
var xSpeed = (5, 4);
var ySpeed = (-4, 5);
var myScore = 0;
var scoreEnemy = 0;

// Canvas
function setup() {
	createCanvas(900, 700);
	getID();
	cursor(ARROW);
	rectMode(CENTER);
	noStroke();

	button = createButton("Start");
	button.mouseClicked(startGame);
	button.size(50,25);
	button.position(10,625);
	button.style("font-family", "Bodoni");
	button.style("font-size", "12px");
}



//Background

function draw() {
	
	// Background
	background(0, 60);
	
	// Paddle
	fill("#00FF00");
	rect(mouseX, 600, 80, 15);
	
	//Functionslo
	
	if (isplaying){
		console.log(isplaying);
		display();
		move();
		bounce();
		paddle();
	}
	
	//resetBall();
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

function bounce() {
	// Seitenabpraller
	if (xBall < 10 || xBall > 900 - 10) {
			xSpeed *= -1;
		}

	if (yBall < 10 ) {
		socket.emit("triggerid", id);
		ySpeed *= -1;
	}
		
	if (yBall > 600 - 10) {
		ySpeed *= -1;
		scoreEnemy++;
		socket.emit('score', scoreEnemy);
		socket.emit('scoreid', id);
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
	
	
	// Reset Ball
	//function resetBall() {
	//  if (yBall >= 400 ||
	//    yBall > 400 - 10) {
	//    ySpeed = 4;
	// }
	
	//}
	
	function display() {
		fill('#00FF00');
		e = ellipse(xBall, yBall, 20, 20);
	}
	
	// Bounce off Paddle
	function paddle() {
		if (isplaying == true) {
			
			if ((xBall > mouseX - 40 && xBall < mouseX + 40) && (yBall + 10 >= 650)) {
				ySpeed *= -1;
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
	