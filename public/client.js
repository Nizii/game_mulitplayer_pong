var socket = io();
var canvas;
var userId;
var keyDelay = 0;
var paddleWidth = 80;
var paddleYPos = 600;
var w = window.innerWidth;
var h = 700;  
var ballArray = [];
var playerArray = []
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
	tutorialScreen4 = false;
	enterNameScreen = false;
	gamesScreen = false;
	gameOverScreen = false;

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
			playerObject = new Player(nameInput.value(), userId, Math.floor(Math.random() * 360), 0);
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

				tutText1 = createElement('p', 'Move the paddle to deflect the ball.');
				tutText1.addClass('tut-text');
				tutContainer = createElement('div');
				tutContainer.addClass('tut-container');
				tutBall1 = createElement('div');
				tutBall1.addClass('tut-ball tut-ball-green tut-ball-anim1');
				tutPaddle = createElement('div');
				tutPaddle.addClass('tut-paddle tut-paddle-anim1');

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

				tutText1.remove();
				tutPaddle.remove();

				tutText2 = createElement('p', 'Collect points but avoid the red colored ones.');
				tutText2.addClass('tut-text');
				tutBall1.removeClass('tut-ball-anim1');
				tutBall2 = createElement('div');
				tutBall2.addClass('tut-ball-gray tut-ball-green tut-ball-red');
			}
			keyDelay = 0;
		}
		keyDelay++;
	}

	if (tutorialScreen2) {
		if (keyIsPressed === true) {
			if (keyCode === 32 && keyDelay > 20) {
				
				tutorialScreen2 = false;
				tutorialScreen3 = true;

				tutText2.remove();

				tutText3 = createElement('p', 'You have 120 seconds to collect points.');
				tutText3.addClass('tut-text');

			}
			keyDelay = 0;
		}
		keyDelay++;
	}

	if (tutorialScreen3) {
		if (keyIsPressed === true) {
			if (keyCode === 32 && keyDelay > 20) {
				
				tutorialScreen3 = false;
				tutorialScreen4 = true;

				tutText3.remove();

				tutText4 = createElement('p', 'The player with most points wins!');
				tutText4.addClass('tut-text');

				
			}
			keyDelay = 0;
		}
		keyDelay++;
	}

	if (tutorialScreen4) {
		if (keyIsPressed === true) {
			if (keyCode === 32 && keyDelay > 20) {
				tutorialScreen3 = false;
				enterNameScreen = true;

				tutContainer.remove();
				tutText4.remove();
				
				nameInput = createInput();
				nameInput.id('name-input');
				startGameButton = createButton("Start Game");
				startGameButton.id('start-game-button');
				enterNameText = createElement('p', 'Enter your Name');
				enterNameText.addClass('enter-name-text');
			}
			keyDelay = 0;
		}
		keyDelay++;
	}

	if (enterNameScreen) {
		background(100,4,13);
		keyDelay = 0;

		
		startGameButton.mouseClicked(function() {
			playerObject = new Player(nameInput.value(), userId, Math.floor(Math.random() * 360), 0);
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
		cursor('none');
		background(100,4,13,0.2);
		for (let ball of ballArray) {
			ball.show();
			ball.update();
			// Seitentrigger
			if (ball.x < 10 || ball.x > w - 10) {
				ball.xSpeed *= -1;
			}

			// Paddle Ball Trigger
			if ((ball.x > mouseX - paddleWidth/2-10 && ball.x < mouseX + paddleWidth/2+10) && (ball.y >= paddleYPos - 10 && ball.y <= paddleYPos + 30)) {
				
				if (ball.ySpeed > 0) {
					ball.ySpeed += 0.5;
					if (ball.color === 'red') {
						playerObject.score -= 3;
					} else if (ball.color === 'green') {
						playerObject.score += 3;
					} else if (ball.color === "white") {
						playerObject.score += 1;
					} else {
						playerObject.score = 0;
					}
					socket.emit("updateScore", playerObject);
				} else {
					ball.ySpeed -= 0.5;
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
						socket.emit("ballData", userId, ball);
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
		fill('#9B9C9B');
		rect(mouseX, paddleYPos + 12, paddleWidth, 6, 0, 0, 4, 4);
		fill(playerObject.color , 40, 70);
		rect(mouseX,mouseY, 30,6);
		triangle(mouseX-20, mouseY, mouseX-10, mouseY-10, mouseX-10, mouseY+10);
		triangle(mouseX+20, mouseY, mouseX+10, mouseY-10, mouseX+10, mouseY+10);
	}
}

function addBall(ySpeed, ballType, color) {
	ballArray.push(new Ball(Math.floor(Math.random() * w/2) + w/4, 50,(Math.random()*2)-1, (Math.random()*2)+3, 20, this.ballId, ballType, color));
}

// Function wird aufgerufen wenn Windowgrösse geändert wird
function windowResized() {
	resizeCanvas(windowWidth, h);
}

// ID wird einmalig zugeteilt
socket.once('user', function(incomeId) {
	userId = incomeId;
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

// Jede x. Sekunde wird ein Ball gedropt
socket.on("addBall", function(time) {
	if (time % 10 === 0) {
		addBall(3, 1, getRandomColor());
	}
});

socket.on("resetBalls", function(){
	ballArray = [];
}) 

socket.once("gameOver", function(array) {
	gamesScreen = false;
	gameOverScreen = true;
	array.sort((a, b) => {
    	return b.score - a.score;
	});
	playerArray = array;
});

// Socket sendet ID von dem Spieler der gerade den Ball abgiebt
socket.on("ballData", function(ball) {
	ballArray.push(new Ball(ball.x, 10 , ball.xSpeed, ball.ySpeed, 20, ball.ballId, ball.ballType, ball.color));
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
	if (i < 1) {
		i++;
		return "black";
	}
	if (i < 4 && i >= 1) {
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