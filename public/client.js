var socket = io();
var id;
var name;
var color;
var isplaying = false;
var paddleWidth = 80;
var paddleYPos = 600;
var w = window.innerWidth;
var h = 700;  
var ballArray = [];
var ready = false;
var playerObject;
// Gamestates
var startScreen = true;
var gamesScreen = false;
var gameOverScreen = false;

function setup() {
	canvas = createCanvas(windowWidth, h);
	cursor('ew-resize');
	rectMode(CENTER);
	colorMode(HSB);
	noStroke();
	fill("#fff");

	// Hier wird der Ballbutton aufgesetzt (Provisorisch)
	button = createButton("Ball");
	button.mouseClicked(newBall);
	button.size(50,25);
	button.position(10,625);
	button.style("font-family", "Bodoni");
	button.style("font-size", "12px");

	// @Lavanya Playername Inputfeld für Startscreen
	nameInput = createInput();
	// @Lavanya id vom nameInput isch mitem File style.css verbunde du chasch det schaffe falls es eifacher isch 
	nameInput.id("nameInput");
	nameInput.position(0, 0);

	// @Lavanya Grosser Startbutton für Startscreen
	startButton = createButton("Start");
	// @Lavanya id vom startButton isch mitem File style.css verbunde du chasch det schaffe falls es eifacher isch 
	startButton.id("startButton");

	startButton.mouseClicked(function() {
		color = Math.floor(Math.random() * 360);
		name = nameInput.value();
		playerObject = new Player(name, id, color, 0);
		socket.emit("lobby", playerObject);
		startScreen = false;
		gamesScreen = true;
		startButton.remove();
		nameInput.remove();
		ready = true;
		socket.emit("timer");
	});
	startButton.position(0,0);
}

function newBall() {
	AddnewBall(3,1);
	// TODO: Delay funktioniert irgendwie noch nicht
	setTimeout(AddnewBall(3,2), 1000);
	setTimeout(AddnewBall(8,3), 1000);
}

function AddnewBall(ySpeed, ballType) {
	ballArray.push(new Ball(Math.floor(Math.random() * w/2) + w/4, 50, 0, ySpeed, 20, this.ballId, ballType));
}
// Background
function draw() {

	// @Lavanya Da isch de Startscreen
	if (startScreen) {
		background('black');
/* 		titleText1 = createElement('h1', 'SUPERPOONG');
		titleText1.addClass('title text1');
		titleText2 = createElement('h1', 'SUPERPOONG');
		titleText2.addClass('title text2');
		titleText3 = createElement('h1', 'SUPERPOONG');
		titleText3.addClass('title text3'); */
	}

	if (gamesScreen) {
		background(0);
		for (let ball of ballArray) {
			ball.show();
			ball.update();
			// Seitenabpraller
			if (ball.x < 10 || ball.x > w - 10) {
				ball.xSpeed *= -1;
			}

			// Hier wird der Bounce zwischen den Bällen und dem Paddle verwaltet
			if ((ball.x > mouseX - paddleWidth/2-10 && ball.x < mouseX + paddleWidth/2+10) && (ball.y >= paddleYPos - 10 && ball.y <= paddleYPos + 20)) {
				ball.ySpeed = ball.ySpeed + 0.5;
				if (ball.ySpeed > 0) {
					playerObject.score += 1;
					socket.emit("updateScore", playerObject);
				}
				ball.ySpeed *= -1;
				// Dynamischer Bounce abhängig von wo der Paddle getroffen wurde
				var d = mouseX - ball.x;
				ball.xSpeed += d * -0.075;				
			}
			
			// Wenn der Ball die obere Kante erreicht wird er aus dem ballArray gelöscht und die Daten des Balls an den Server geschickt
			if (ball.y < 10) {
				for (let x = 0; x < ballArray.length; x++) {
					if (ball.ballId === ballArray[x].ballId) {
						socket.emit("ballData", id, ball.ballId, ball.x, ball.xSpeed, ball.ySpeed, ball.ballType);
						ballArray.splice(x, 1); 
					}
				}	
			}

			// Wenn der Ball die untere Kante erreicht wird er gelöscht und der Score wird erhöht
			if (ball.y >= h) {
				ball.ySpeed *= -1;
			}
		}

		if (gameOverScreen) {
			background(255, 204, 0);
		}

		// Das Paddle
		fill(color, 40, 100);
  		noStroke();
  		rect(mouseX, paddleYPos + 5, paddleWidth, 20, 25, 25, 4, 4);
		
		// STRESSTEST: Zeigt die Framerate unten rechts an
		/* let fps = frameRate();
		text("FPS: " + fps.toFixed(2), w - 10, height - 10); */
	}

	function keyPressed() {
		if (keyCode === SPACE) {
		  newBall();
		}
	}
}

// DEBUG: URSACHE FÜR BLACK BACKGROUND BEI RESIZE
// macht Fullscreen in width
/* window.onresize = function() {
	w = window.innerWidth;
	h = 700;  
	canvas.size(w,h);
} */

// Function wird aufgerufen wenn Windowgrösse geändert wird
function windowResized() {
	resizeCanvas(windowWidth, h);
}

// ID wird einmalig zugeteilt
socket.once('user', function(msg) {
	id = msg;
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
	remain.position(windowWidth-100,0);
});

// Socket sendet ID von dem Spieler der gerade den Ball abgiebt
socket.on("ballData", function(ballId, x, xSpeed, ySpeed) {
	ballArray.push(new Ball(x, 10 , xSpeed, ySpeed, 20, ballId));
});

socket.on("ready", function() {
	socket.emit("ready", ready);
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

class Player {
    constructor(name, id, color, score) {
        this.name = name;
        this.id = id;
		this.color = color;
		this.score = score;
    }
}