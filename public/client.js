// Unsere liebe Socket
var socket = io();
// Aktuelle ID des Spielers
var id;
// State zeigt ob der Spieler gerade den Ball hat
var isplaying = false;
// Die Spielfeldbreite
var canvasWidth = 900;
// Paddle Breite
var paddleWidth = 80;
// Die Scorevarriabeln
var myScore = 0;
var enemyScore = 0;
var w = window.innerWidth;
var h = 700;  

// Array mit allen Bällen
var ballArray = [];
// Alle aktiven User
var userArray = [];
// Game States
var startScreen = true;
var gamesScreen = false;
var gameOverScreen = false;
// Hat Spieler Ready Button gedrückt?
var ready = false;

// Hier wird der Setup gemacht
function setup() {
	canvas = createCanvas(w, h);
	// ID wird verteilt
	getID();
	cursor('ew-resize');
	rectMode(CENTER);
	colorMode(HSB);
	noStroke();
	fill("#fff");
	socket.emit("ready", ready, id);

	// Hier wird der Startbutton aufgesetzt
	button = createButton("Start");
	button.mouseClicked(function() {
		ballArray.push(new Ball(Math.floor(Math.random() * canvasWidth/2) + canvasWidth/4, 50 , 0, 3, 20, this.ballId));
	});

	button.size(50,25);
	button.position(10,625);
	button.style("font-family", "Bodoni");
	button.style("font-size", "12px");

	startButton = createButton("Start");
	startButton.id("startButton");
	startButton.mouseClicked(function() {
		startScreen = false;
		gamesScreen = true;
		startButton.remove();
		ready = true;
	});
	startButton.position(0,0);
}

// Background
function draw() {
	if (startScreen) {
		background('white');
		fill(255);
		textAlign(CENTER, CENTER);
		return;
	}

	if (gamesScreen) {
		background(0);
		// STRESSTEST: Zeigt die Framerate unten rechts an
			/* let fps = frameRate();
			text("FPS: " + fps.toFixed(2), w - 10, height - 10); */
		
		for (let ball of ballArray) {
			// Zeigt den Ball an
			ball.show();
			// Bewegt Ball
			ball.update();
			// Seitenabpraller
			if (ball.x < 10 || ball.x > w - 10) {
				ball.xSpeed *= -1;
			}

			// Hier wird der Bounce zwischen den Bällen und dem Paddle verwaltet
			if ((ball.x > mouseX - paddleWidth/2+5 && ball.x < mouseX + paddleWidth/2+5) && (ball.y + 10 >= 600)) {
				ball.ySpeed = ball.ySpeed + 0.5;
				ball.ySpeed *= -1;
				// Dynamischer Bounce abhängig von wo der Paddle getroffen wurde
				var d = mouseX - ball.x;
				ball.xSpeed += d * -0.1;
			}
			
			// Wenn der Ball die obere Kante erreicht wird er aus dem ballArray gelöscht und die Daten des Balls an den Server geschickt
			if (ball.y < 10) {
				for (let x = 0; x < ballArray.length; x++) {
					if (ball.ballId === ballArray[x].ballId) {
						console.log(id);
						socket.emit("ballData", id, ball.ballId, ball.x, ball.xSpeed, ball.ySpeed);
						ballArray.splice(x, 1); 
					}
				}	
			}

			// UPDATE NEEDED
			// Wenn der Ball die untere Kante erreicht wird er gelöscht und der Score wird erhöht
			if (ball.y >= 700 - 10) {
				for (let x = 0; x < ballArray.length; x++) {
					if (ball.ballId === ballArray[x].ballId) {
						ballArray.splice(x, 1); 
						socket.emit('score', enemyScore);
						socket.emit('scoreid', id);
					}
				}	
			}
		}

		if (gameOverScreen) {
			background(255, 204, 0);
		}

		// Das Paddle
		//arc(mouseX, 605, paddleWidth, 30, PI, 0, CHORD);
		//rect(mouseX, 600, paddleWidth, 2);
		//rect(mouseX, 605, paddleWidth/2, 2);
		//rect(mouseX, 610, paddleWidth/3, 2);
		fill(196);
  		noStroke();
  		rect(mouseX, 600, paddleWidth, 20, 25, 25, 4, 4);
		// Score Text
		textSize(24);
		textAlign(RIGHT);
		text("ME " + myScore + '-' + enemyScore + " OPPONENT", w-10, 40);
	}
}

// URSACHE FÜR BLACK BACKGROUND BEI RESIZE
// macht Fullscreen in width
window.onresize = function() {
	w = window.innerWidth;
	h = 700;  
	canvas.size(w,h);
}

// Function wird aufgerufen wenn Windowgrösse geändert wird
function windowResized() {
	resizeCanvas(windowWidth, h);
}




socket.on("userArray", function(userArray) {
	let yAxis = 0;
	$(".users").remove();
	for(let x = 0; x < userArray.length; x++) {
		const user = createElement('h5', userArray[x]);
		user.addClass( "users" );
		user.style('color', 'black');
		console.log(userArray[x]);
	}
});



// Socket sendet ID von dem Spieler der gerade den Ball abgiebt
socket.on("ballData", function(ballId, x, xSpeed, ySpeed) {
	ballArray.push(new Ball(x, 10 , xSpeed, ySpeed, 20, ballId));
});

socket.on("ready", function() {
	socket.emit("ready", ready);
});

// Hier wird die Score über die Socket gehandelt
socket.on('scoreid', function(scoreId) {
	// Wer bekommt den Punkt?
	if (scoreId != id) {
		myScore++;
	} else {
		enemyScore++;
	}
});
	
// ID wird einmalig zugeteilt und auf Screen ausgegeben
function getID(){
	socket.once('user', function(msg) {
		id = msg;
		let h5 = createElement('h5', msg);
		h5.style('color', '#00a1d3');
		h5.position(10, 650);
	});
}

// Reservefunktion falls noch Zeit vorhanden Handy
function checkMobileInput() {
	if (window.DeviceOrientationEvent) {
		//console.log("is Working");
		window.addEventListener("deviceorientation", function(event) {
			event.gamma
			console.log(event.gamma);
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