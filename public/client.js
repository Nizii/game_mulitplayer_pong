var socket = io();
var canvas;
var id;
var keyDelay = 0;
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
	rectMode(CENTER);
	colorMode(HSB);
	noStroke();
	fill("#fff");

	startScreen = true;
	tutorialScreen1 = false;
	tutorialScreen2 = false;
	tutorialScreen3 = false;
	enterNameScreen = false;
	gamesScreen = false;
	gameOverScreen = false;

	// DEBUG Ball zum testen (Provisorisch)
/* 	button = createButton("DEBUG Ball");
	button.mouseClicked(addBall);
	button.size(90,25);
	button.position(10,625); */


	// Elemente für den Start Screen
	startButton = createButton("START");
	startButton.id('start-button');
	titleText1 = createElement('h1', 'SUPERPOOONG');
	titleText1.addClass('title text1');
	titleText2 = createElement('h1', 'SUPERPOOONG');
	titleText2.addClass('title text2');
	titleText3 = createElement('h1', 'SUPERPOOONG');
	titleText3.addClass('title text3');
	pressSpace = createElement('p', 'or press [Space] for tutorial');
	pressSpace.addClass('press-space');


	startButton.mouseClicked(function() {
		startScreen = false;
		enterNameScreen = true;
		enterNameText = createElement('p', 'Enter your Name');
		enterNameText.addClass('enter-name-text');
		nameInput = createInput();
		nameInput.id('name-input');


		startButton.remove();
		pressSpace.remove();
		titleText1.remove();
		titleText2.remove();
		titleText3.remove();

		startGameButton = createButton("Start Game");
		startGameButton.id('start-game-button');
		startGameButton.mouseClicked(function() {
			playerObject = new Player(nameInput.value(), id, Math.floor(Math.random() * 360), 0);
			socket.emit("lobby", playerObject);
			addBall(3, 1, getRandomColor());
			socket.emit("timer");
			enterNameScreen = false;
			gamesScreen = true;

			enterNameText.remove();
			nameInput.remove();
			startGameButton.remove();

		});
	});
}

function draw() {
	if (startScreen) {
		background(100,4,13);
		if (keyIsPressed === true) {
			if (keyCode === 32) {
				startScreen = false;
				tutorialScreen1 = true;
				
				startButton.remove();
				pressSpace.remove();
				titleText1.remove();
				titleText2.remove();
				titleText3.remove();
			}
		}	
	}
	
	if (tutorialScreen1) {
		if (keyIsPressed === true) {
			if (keyCode === 32 && keyDelay > 20) {
				tutorialScreen1 = false;
				tutorialScreen2 = true;
				
				// Hier Elemente, die nur einmal im DOM erstellt und entfernt werden sollen
			}
			keyDelay = 0;

		background(100,4,13);
		fill('white');
		textSize(30);
		textFont('Wallpoet');
		text("Use the paddle to deflect the ball", 100, 100)
		keyDelay++;
		}
		
	}
		paddle = createElement('div');
		paddle.addClass('paddle');
	

	if (tutorialScreen2) {
		if (keyIsPressed === true) {
			if (keyCode === 32 && keyDelay > 20) {
				
				tutorialScreen2 = false;
				tutorialScreen3 = true;
				
				// Hier Elemente, die nur einmal im DOM erstellt und entfernt werden sollen
			}
			keyDelay = 0;
		}
		background(100,4,13);
		fill('white');
		textSize(30);
		text("If you miss the ball", 100, 100)
		keyDelay++;
	}

	if (tutorialScreen3) {
		if (keyIsPressed === true) {
			if (keyCode === 32 && keyDelay > 20) {
				tutorialScreen3 = false;
				enterNameScreen = true;
				
				// Hier Elemente, die nur einmal im DOM erstellt und entfernt werden sollen
				nameInput = createInput();
				nameInput.id('name-input');
				startGameButton = createButton("Start Game");
				startGameButton.id('start-game-button');
				enterNameText = createElement('p', 'Enter your Name');
				enterNameText.addClass('enter-name-text');
			}
			keyDelay = 0;
		}
		background(100,4,13);
		fill('white');
		textSize(30);
		textFont('Wallpoet');
		text("Avoid the red ones ! It must not be touched !", 100, 100)
		keyDelay++;
	}

	if (enterNameScreen) {
		background(100,4,13);
		keyDelay = 0;

		
		startGameButton.mouseClicked(function() {
			playerObject = new Player(nameInput.value(), id, Math.floor(Math.random() * 360), 0);
			socket.emit("lobby", playerObject);
			addBall(3, 1, getRandomColor());
			socket.emit("timer");
			enterNameScreen = false;
			gamesScreen = true;

			enterNameText.remove();
			nameInput.remove();
			startGameButton.remove();
		});


	}
	if (gamesScreen) {
		cursor('ew-resize');
		background(100,4,13);
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
					if (ball.color === 'red') {
						playerObject.score -= 3;
					} else if (ball.color === 'green') {
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
			background('white');
		}

		// Das Paddle
		fill(playerObject.color , 40, 100);
  		noStroke();
  		rect(mouseX, paddleYPos + 5, paddleWidth, 20, 25, 25, 4, 4);	
	}
}

function addBall(ySpeed, ballType, color) {
	ballArray.push(new Ball(Math.floor(Math.random() * w/2) + w/4, 50, 0, ySpeed, 20, this.ballId, ballType, color));
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

let i = 0;
function getRandomColor(){
	let randNumb = Math.floor(Math.random() * 3);
	if (i < 4) {
		i++;
		return "white";
		} else {
			if (randNumb === 0) {
				return "red";
			} else if (randNumb === 1) {
				return "white";
			} else {
				return "green";
			}
		}
	}