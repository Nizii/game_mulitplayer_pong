var socket = io();
var canvas;
var id;
var isplaying = false;
var paddleWidth = 80;
var paddleYPos = 600;
var w = window.innerWidth;
var h = 700;  
var ballArray = [];
var playerObject;
// Gamestates
var startScreen;
var gamesScreen;
var gameOverScreen;

function setup() {
	canvas = createCanvas(windowWidth, h);
	cursor('ew-resize');
	rectMode(CENTER);
	colorMode(HSB);
	noStroke();
	fill("#fff");

	startScreen = true;
	gamesScreen = false;
	gameOverScreen = false;

	nameInput = createInput();
	nameInput.id("nameInput");
	nameInput.position(0, 0);
	startButton = createButton("Start");
	startButton.id("startButton");
	startButton.mouseClicked(function() {
		playerObject = new Player(nameInput.value(), id, Math.floor(Math.random() * 360), 0);
		socket.emit("lobby", playerObject);
		startScreen = false;
		gamesScreen = true;
		startButton.remove();
		nameInput.remove();
		socket.emit("timer");
		addBall(3, 1, getRandomColor());
	});
	startButton.position(0,0);
}

function addBall(ySpeed, ballType, color) {
	ballArray.push(new Ball(Math.floor(Math.random() * w/2) + w/4, 50, 0, ySpeed, 20, this.ballId, ballType, color));
}

function draw() {
	if (startScreen) {
		background('black');
	}

	if (gamesScreen) {
		background(0);
		for (let ball of ballArray) {
			ball.show();
			ball.update();
			// Seitentrigger
			if (ball.x < 10 || ball.x > w - 10) {
				ball.xSpeed *= -1;
			}

			// Paddle Ball Trigger
			if ((ball.x > mouseX - paddleWidth/2-10 && ball.x < mouseX + paddleWidth/2+10) && (ball.y >= paddleYPos - 10 && ball.y <= paddleYPos + 20)) {
				ball.ySpeed = ball.ySpeed + 0.5;
				if (ball.ySpeed > 0) {
					if (ball.color === "red") {
						playerObject.score -= 3;
					} else if (ball.color === "green") {
						playerObject.score += 3;
					} else {
						playerObject.score += 1;
					}
					socket.emit("updateScore", playerObject);
				}
				ball.ySpeed *= -1;
				// Dynamischer Bounce abhängig von wo der Paddle getroffen wurde
				var d = mouseX - ball.x;
				ball.xSpeed += d * -0.075;				
			}
			
			// Decken Trigger
			if (ball.y < 10) {
				for (let x = 0; x < ballArray.length; x++) {
					if (ball.ballId === ballArray[x].ballId) {
						socket.emit("ballData", id, ball.ballId, ball.x, ball.xSpeed, ball.ySpeed, ball.ballType, ball.color);
						ballArray.splice(x, 1); 
					}
				}	
			}

			// Bodentrigger
			if (ball.y >= h) {
				ball.ySpeed *= -1;
			}
		}

		if (gameOverScreen) {
			background(white);
		}

		// Das Paddle
		fill(playerObject.color , 40, 100);
  		noStroke();
  		rect(mouseX, paddleYPos + 5, paddleWidth, 20, 25, 25, 4, 4);
	}
}

// Function wird aufgerufen wenn Windowgrösse geändert wird
function windowResized() {
	resizeCanvas(windowWidth, h);
}

// ID wird einmalig zugeteilt
socket.once('user', function(incomeId) {
	id = incomeId;
});

socket.on("lobby", function(playerObjectArray) {
	$(".users").remove();
	for(let x = 0; x < playerObjectArray.length; x++) {
		let playerInfoString = " " + Object.values(playerObjectArray[x])[0] + " " + Object.values(playerObjectArray[x])[3];
		let user = createElement('h5', playerInfoString);
		user.addClass( "users" );
		user.style('color', 'white');
		user.style('font-size', '20px');
	}
});

socket.on("timer", function(time) {
	$(".timer").remove();
	let timerString = time;
	let remain = createElement('h5', timerString);
	remain.addClass( "timer" );
	remain.style('color', 'white');
	remain.style('font-size', '60px');
	remain.position(windowWidth - 100, 0);
});

// Jede 5. Sekunde wird ein Ball gedropt
socket.on("addBall", function(time) {
	if (time % 5 === 0) {
		addBall(3, 1, getRandomColor());
	}
});

socket.once("gameOver", function() {
	console.log("GameOver");
	gamesScreen = false;
	gameOverScreen = true;
	canvas.remove();
});

// Socket sendet ID von dem Spieler der gerade den Ball abgiebt
socket.on("ballData", function(ballId, x, xSpeed, ySpeed, ballType, color) {
	ballArray.push(new Ball(x, 10 , xSpeed, ySpeed, 20, ballId, ballType, color));
});

// Reservefunktion falls noch Zeit vorhanden Handy
function checkMobileInput() {
	if (window.DeviceOrientationEvent) {
		window.addEventListener("deviceorientation", function(event) {
			event.gamma
		}, true);
	} else {
		console.log("Not Supportet Device");
	}
}
	
// Generiert einen Random String, kann für IDs verwendet werden
function generateRandomString() {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	var string_length = 6;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
  }

function getRandomColor(){
	let randNumb = Math.floor(Math.random() * 3);
	if (randNumb === 0) {
		return "red";
	} else if (randNumb === 1) {
		return "white";
	} else {
		return "green";
	}
}