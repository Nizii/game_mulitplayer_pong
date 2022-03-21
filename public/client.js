// Unsere liebe Socket
var socket = io();
// Aktuelle ID des Spielers
var id;
var playerName;
var playerColor;
// State zeigt ob der Spieler gerade den Ball hat
var isplaying = false;
// Paddle Breite
var paddleWidth = 80;
// Paddle Position in Y Achse
var paddleYPos = 600;
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

var idAndNameObject;



// Hier wird der Setup gemacht
function setup() {
	canvas = createCanvas(windowWidth, h);
	// ID wird verteilt
	
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
		// Zufälliger Hue Wert für die Spielfarbe des Players
		playerColor = Math.floor(Math.random() * 360);
		playerName = nameInput.value();
		socket.emit("player", new Player(playerName, id, playerColor));
		startScreen = false;
		gamesScreen = true;
		startButton.remove();
		nameInput.remove();
		ready = true;
	});
	startButton.position(0,0);
}

function newBall(ySpeed) {
	ballArray.push(new Ball(Math.floor(Math.random() * w/2) + w/4, 50 , 0, ySpeed, 20, this.ballId, ballType));
	console.log(ballArray);
	//setTimeout(newBall, 2000);
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
		// Hintergrund
		background(0);

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
			if ((ball.x > mouseX - paddleWidth/2-10 && ball.x < mouseX + paddleWidth/2+10) && (ball.y >= paddleYPos - 10 && ball.y <= paddleYPos + 20)) {
				ball.ySpeed = ball.ySpeed + 0.5;
				ball.ySpeed *= -1;
				 
				// Dynamischer Bounce abhängig von wo der Paddle getroffen wurde
				var d = mouseX - ball.x;
				ball.xSpeed += d * -0.075;				
			}
			
			// Wenn der Ball die obere Kante erreicht wird er aus dem ballArray gelöscht und die Daten des Balls an den Server geschickt
			if (ball.y < 10) {
				for (let x = 0; x < ballArray.length; x++) {
					if (ball.ballId === ballArray[x].ballId) {
						console.log("ID = "+ id);
						socket.emit("ballData", id, ball.ballId, ball.x, ball.xSpeed, ball.ySpeed, ball.ballType);
						ballArray.splice(x, 1); 
					}
				}	
			}

			// UPDATE NEEDED
			// Wenn der Ball die untere Kante erreicht wird er gelöscht und der Score wird erhöht
			if (ball.y >= h) {
				ball.ySpeed *= -1;
				/* for (let x = 0; x < ballArray.length; x++) {
					if (ball.ballId === ballArray[x].ballId) {
						ballArray.splice(x, 1); 
						socket.emit('score', enemyScore);
						socket.emit('scoreid', id);
					}
				}	 */
			}
		}

		if (gameOverScreen) {
			background(255, 204, 0);
		}

		// Das Paddle
		//arc(mouseX, paddleYPos + 5, paddleWidth, 30, PI, 0, CHORD);
		//rect(mouseX, paddleYPos, paddleWidth, 2);
		//rect(mouseX, paddleYPos + 5, paddleWidth/2, 2);
		//rect(mouseX, paddleYPos + 5, paddleWidth/3, 2);
		fill(playerColor, 40, 100);
  		noStroke();
  		rect(mouseX, paddleYPos + 5, paddleWidth, 20, 25, 25, 4, 4);
		

		// Score Text
		fill(196);
		textSize(24);
		textAlign(RIGHT);
		text("ME " + myScore + '-' + enemyScore + " OPPONENT", w-10, 40);

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

// ID wird einmalig zugeteilt und auf Screen ausgegeben
socket.once('user', function(msg) {
	id = msg;
	let playerId = createElement('h5', msg);
	playerId.style('color', '#00a1d3');
	playerId.position(10, 650);
});

//socket.on("userArray", function(userArray) {
socket.on("player", function(playerObjectArray) {
	$(".users").remove();
	for(let x = 0; x < playerObjectArray.length; x++) {
		let user = createElement('h5', Object.values(playerObjectArray[x])[0]);
		user.addClass( "users" );
		user.style('color', 'white');
		user.style('font-size', '20px');
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

class Player {
    constructor(playerName, id) {
        this.playerName = playerName;
        this.id = id;
		this.playerColor = playerColor;
    }
}