// Unsere liebe Socket
var socket = io();
// Aktuelle ID des Spielers
var id;
// State zeigt ob der Spieler gerade den Ball hat
var isplaying = false;
// Der Ball
var ball;
// Die Spielfeldbreite
var canvasWidth = 900;
// Ball wird beim ersten Zug Random auf X platziert
var xBall = Math.floor(Math.random() * canvasWidth/2) + canvasWidth/4;
// Starthöhe 
var yBall = 50;
// Geschwindikeit des Balls X und Y am Start
var xSpeed = 0;
var ySpeed = 3;
// Die Scorevarriabeln
var myScore = 0;
var enemyScore = 0;

// Hier wird der Setup gemacht
function setup() {
	createCanvas(canvasWidth, 700);
	// ID wird verteilt
	getID();
	cursor('ew-resize');
	rectMode(CENTER);
	noStroke();

	// Hier wird der Startbutton aufgesetzt
	button = createButton("Start");
	button.mouseClicked(startGame);
	button.size(50,25);
	button.position(10,625);
	button.style("font-family", "Bodoni");
	button.style("font-size", "12px");
}

// Background
function draw() {
	// Für Delay-gradient Effekt hier ", 60" einfügen
	background(0);

	// Das Paddle
	fill("#fff");
	rect(mouseX, 600, 80, 2);
	rect(mouseX, 605, 60, 2);
	rect(mouseX, 610, 30, 2);

	
	// Wird nur ausgeführt wenn der Ball im Screen ist

	if (isplaying){
		display();
		move();
		bounce();
		paddle();
	}

	// Score Text
	fill('#fff');
	textSize(24);
	text("ME " + myScore + '-' + enemyScore + " OPPONENT", canvasWidth-250, 40);
}

// Bewegt Ball
function move() {
	xBall += xSpeed;
	yBall += ySpeed;
}

// Startet das Spiel
function startGame(){
	isplaying = true;
}


// Ist für Bouncerei des Balls zuständig
function bounce() {

	// Seitenabpraller
	if (xBall < 10 || xBall > canvasWidth - 10) {
			xSpeed *= -1;
		}

	// Triggert Ballseitenwechsel verschickt die ID und die X Pos des Balls
	if (yBall < 10 ) {
		// uncomment below to make multiplayer
		socket.emit("triggerid", id);
		socket.emit("getX", xBall);
		ySpeed *= -1;
		socket.emit("getYSpeed", ySpeed);
		socket.emit("getXSpeed", -xSpeed);
	}
		
	// Triggert Punkt
	if (yBall > 700 - 10) {
		ySpeed *= -1;
		socket.emit('score', enemyScore);
		socket.emit('scoreid', id);

		// Automatic ball reset
		yBall = 50;
		xBall = Math.floor(Math.random() * canvasWidth/2) + canvasWidth/4;
		xSpeed = 0;
		ySpeed = 3;
	}
}

	// Socket sendet ID von dem Spieler der gerade den Ball abgiebt
	socket.on("triggerid", function(triggerid){
		if (triggerid != id) {
			isplaying = true;
			// Holt sich neue X Position und Richtung des Balls damit der Übergang zum nächsten Spieler auch schön geschmeidig ist
			socket.on("getX", function(newX){
				xBall = canvasWidth-newX;
			});
			socket.on("getYSpeed", function(newYSpeed){
				YSpeed = newYSpeed;
			});
			socket.on("getXSpeed", function(newXSpeed){
				xSpeed = newXSpeed;
			});
		} else {
			isplaying = false;
		}
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
	
	// Erzeugt den Ball
	function display() {
		fill('#fff');
		e = ellipse(xBall, yBall, 20, 20);
	}
	
	// Hier wird der Bounce zwischen dem Ball und dem Paddle verwaltet
	function paddle() {
		if ((xBall > mouseX - 40 && xBall < mouseX + 40) && (yBall + 10 >= 600)) {
			ySpeed = ySpeed + 0.5;
			ySpeed *= -1;

			// Dynamischer Bounce abhängig von wo der Paddle getroffen wurde
			var d = mouseX - xBall;
			xSpeed += d * -0.1;
			console.log(ySpeed);
		}
	}
	
	// ID wird einmalig zugeteilt und auf Screen ausgegeben
	function getID(){
		socket.once('user', function(msg) {
			id = msg;
			let h5 = createElement('h5', msg);
			h5.style('color', '#00a1d3');
			h5.position(10, 650);
		});
	}


	if (window.DeviceMotionEvent == undefined) {
		//No accelerometer is present. Use buttons.
		alert("no accelerometer => "+ window.DeviceMotionEvent);
	  } else {
		alert("accelerometer found");
		window.addEventListener("devicemotion", (event) => {
		  motion.x = -event.acceleration.x;
		  motion.y = event.acceleration.y;
		});
	  }