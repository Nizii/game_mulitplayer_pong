var socket = io();
var canvas;
var userId;
let tutCountdown;
let tutCounter;
let tutCounterText;
var keyDelay = 0;
var paddleWidth = 80;
var paddleYPos = 600;
var w = window.innerWidth;
var h = 700;  
var ballArray = [];
var playerArray = []
var playerObject;
var gameOver;
// Gamestates
var startScreen,gamesScreen,gameOverScreen,tutorialScreen1,tutorialScreen2,tutorialScreen3,tutorialScreen4,enterNameScreen;

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
	gameOver = false;

	// Elemente für den Start Screen
	startButton = createButton("START");
	startButton.id('start-button');
	titleText1 = createElement('h1', 'SUPERPOOONG');
	titleText1.addClass('title text1');
	titleText2 = createElement('h1', 'SUPERPOOONG');
	titleText2.addClass('title text2');
	titleText3 = createElement('h1', 'SUPERPOOONG');
	titleText3.addClass('title text3');
	pressSpace = createP('or press [Space] for tutorial');
	pressSpace.addClass('press-space');

	startButton.mouseClicked(function() {
		startScreen = false;
		enterNameScreen = true;
		enterNameText = createP('Enter your Name');
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
	});
}

function draw() {
	
	if (startScreen) {
		background(100,4,13);
		if (keyIsPressed === true) {
			if (keyCode === 32) {
				startScreen = false;
				tutorialScreen1 = true;

				tutText1 = createP('Move the paddle to deflect the ball');
				tutText1.addClass('tut-text');

				tutContainer = createDiv();
				tutContainer.addClass('tut-container');

				tutBall = createDiv();
				tutBall.addClass('tut-ball tut-ball-green tut-ball-anim1');

				tutPaddle = createDiv();
				tutPaddle.addClass('tut-paddle tut-paddle-anim1');

				tutPressSpace = createP('Press [Space] to continue');
				tutPressSpace.addClass('press-space tut-press-space');

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
				tutBall.remove();

				tutText2 = createP('Watch out for the colors !');
				tutText2.addClass('tut-text');

				tutBallText1 = createP('+10p')
				tutBallText1.addClass('score-text score-text-pos score-text-pos1')
				tutBall1 = createDiv();
				tutBall1.addClass('tut-ball tut-ball-gray tut-ball-pos tut-ball-pos1');
				
				tutBallText2 = createElement('p', '+30p');
				tutBallText2.addClass('score-text score-text-pos score-text-pos2');
				tutBall2 = createDiv();
				tutBall2.addClass('tut-ball tut-ball-green tut-ball-pos tut-ball-pos2');
				
				tutBallText3 = createElement('p', '-30p');
				tutBallText3.addClass('score-text score-text-pos score-text-pos3');
				tutBall3 = createDiv();
				tutBall3.addClass('tut-ball tut-ball-red tut-ball-pos tut-ball-pos3');

				tutBallText4 = createP('score reset');
				tutBallText4.addClass('score-text score-text-pos score-text-pos4');
				tutBall4 = createDiv();
				tutBall4.addClass('tut-ball tut-ball-black tut-ball-pos tut-ball-pos4');	
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
				tutBallText1.remove();
				tutBall1.remove();
				tutBallText2.remove();
				tutBall2.remove();
				tutBallText3.remove();
				tutBall3.remove();
				tutBallText4.remove();
				tutBall4.remove();
				
				tutText3 = createP('You have 120 seconds to collect points');
				tutText3.addClass('tut-text');

				tutCounter = 120;
			}
			keyDelay = 0;
		}
		keyDelay++;
	}

	if (tutorialScreen3) {
		background(100,4,13);
		if (keyIsPressed === true) {
			if (keyCode === 32 && keyDelay > 20) {
				
				tutorialScreen3 = false;
				tutorialScreen4 = true;

				tutText3.remove();

				tutText4 = createP('The player with most points wins!');
				tutText4.addClass('tut-text');

				tutking = createDiv();
				tutking.addClass('tutbild')
			}
			keyDelay = 0;
		}
		let time = int(millis() / 1200);
		tutCountdown = tutCounter - time;

		
		textAlign(CENTER);
		textSize(16);
		textFont('Saira');

		if (tutCountdown <= 0) {
			counterText = text("What are you still doing here?", windowWidth/2,400);
			tutCountdown = 0;
			
		} else {
			textSize(48);
			counterText = text(tutCountdown + "s", windowWidth/2,400);
		}

		keyDelay++;
	}

	if (tutorialScreen4) {
		background(100,4,13);
		if (keyIsPressed === true) {
			if (keyCode === 32 && keyDelay > 20) {
				tutorialScreen4 = false;
				enterNameScreen = true;

				tutContainer.remove();
				tutText4.remove();
				tutPressSpace.remove();

				
				nameInput = createInput();
				nameInput.id('name-input');
				startGameButton = createButton("Start Game");
				startGameButton.id('start-game-button');
				enterNameText = createP('Enter your Name');
				enterNameText.addClass('enter-name-text');
			}
			keyDelay = 0;
		}
		keyDelay++;

		fill('#DDE394');
		triangle(windowWidth/2-30,420,windowWidth/2+30,420,windowWidth/2,350);
		triangle(windowWidth/2-30,420,windowWidth/2+30,420,windowWidth/2+50,370);
		triangle(windowWidth/2-30,420,windowWidth/2+30,420,windowWidth/2-50,370)

	}

	if (enterNameScreen) {
		background(100,4,13);
		keyDelay = 0;

		startGameButton.mouseClicked(function() {
			playerObject = new Player(nameInput.value(), userId, Math.floor(Math.random() * 12)*30, 0);
			socket.emit("lobby", playerObject);
			addBall(3, 1, getRandomColor());
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
		background(100,4,13);
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
					if (ball.ySpeed <= 10) { // Max Speed
						ball.ySpeed += 0.5;
					}
					if (ball.color === 'red') {
						playerObject.score -= 30;
					} else if (ball.color === 'green') {
						playerObject.score += 30;
					} else if (ball.color === "white") {
						playerObject.score += 10;
					} else {
						playerObject.score = 0;
					}
					socket.emit("updateScore", playerObject);
				} else {
					if (ball.ySpeed >= -10) { // Max Speed
						ball.ySpeed -= 0.5;
					}
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
			if (ball.y >= h-10) {
				ball.ySpeed *= -1;
			}
		}

		// Das Paddle
		fill(playerObject.color , 40, 100);
  		noStroke();
  		rect(mouseX, paddleYPos + 5, paddleWidth, 20, 25, 25, 4, 4);
		fill('#5c5c5c');
		rect(mouseX, paddleYPos + 12, paddleWidth, 6, 0, 0, 4, 4);
		fill(playerObject.color , 40, 70);
		rect(mouseX,mouseY, 30,6);
		triangle(mouseX-20, mouseY, mouseX-10, mouseY-10, mouseX-10, mouseY+10);
		triangle(mouseX+20, mouseY, mouseX+10, mouseY-10, mouseX+10, mouseY+10);
	}
}

function addBall(ySpeed, ballType, color) {
	ballArray.push(new Ball(Math.floor(Math.random() * w/2) + w/4, 50,(Math.random()*2)-1, Math.floor((Math.random())+3), 20, this.ballId, ballType, color));
}

// Function wird aufgerufen wenn Windowgrösse geändert wird
function windowResized() {
	resizeCanvas(windowWidth, h);
}

// ID wird einmalig zugeteilt
socket.once('user', function(incomeId) {
	userId = incomeId;
});

socket.on("lobby", function(array) {
	if(!gameOver) {
		array.sort((a, b) => {
			return b.score - a.score;
		});
		$(".users").remove();
		for(let x = 0; x < array.length; x++) {
			let playerInfoString = " " + Object.values(array[x])[0] + " " + Object.values(array[x])[3];
			let user = createElement('h5', playerInfoString);
			user.addClass("users");
			 userColor = color(Object.values(array[x])[2], 40, 100);
			user.style('color', userColor);
		}
	} else {
	//socket.on("deleteLobby", function(){
		$(".users").remove();
	//});
	}
});

socket.on("timer", function(time) {
	$(".timer").remove();
	let timerString = time;
	let remain = createElement('h5', timerString + 's');
	remain.addClass( "timer" );
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

// Und der Titel an die "Hässlichste Function/Socket geht an"...
// Sie ist für das GameOver handling zuständig
socket.once("gameOver", function(array) {
	gameOver = true;
	gamesScreen = false;
	restartButton = createButton("Restart");
	restartButton.id('start-button');
	array.sort((a, b) => {
    	return b.score - a.score;
	});
	let resultTitle = createElement('h5', "Ranking");
	resultTitle.addClass("resultTitle");
	resultTitle.style('color', "White");
	$(".resultElement").remove();
	for(let x = 0; x < array.length; x++) {
		let playerInfoString = " " + Object.values(array[x])[0] + " " + Object.values(array[x])[3];
		let user = createElement('h5', playerInfoString);
		user.addClass("resultElement");
		let userColor = color(Object.values(array[x])[2], 40, 100);
		user.style('color', userColor);
	}
	restartButton.mouseClicked(function() {
		restartButton.remove();
		location.reload();
	});
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


