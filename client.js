// Unsere liebe Socket
var socket = io();
// Aktuelle ID des Spielers
var id;
// State zeigt ob der Spieler gerade den Ball hat
var isplaying = false;
// Der Ball
var ball;
// Ball wird beim ersten Zug Random auf X platziert
var xBall = Math.floor(Math.random() * 300) + 50;
// Starthöhe 
var yBall = 50;
// Geschwindikeit des Balls X und Y 
var xSpeed = (5, 4);
var ySpeed = (-4, 5);
// Die Scorevarriabeln
var myScore = 0;
var enemyScore = 0;

// Hier wird der Setup gemacht
function setup() {
	createCanvas(600, 700);
	// ID wird verteilt
	getID();
	cursor('ew-resize');
	rectMode(CENTER);
	noStroke();

	// Hier wird der Startbutton aufgesetzt
	button = createButton("Start");
	button.mouseClicked(startGame);
	button.size(50,25);
	button.position(10,650);
	button.style("font-family", "Bodoni");
	button.style("font-size", "12px");
}

// Background
function draw() {
	background(0, 60);

	// Das Paddle
	fill("#00FF00");
	rect(mouseX, 600, 80, 15);
	
	// Wird nur ausgeführt wenn der Ball im Screen ist

	if (isplaying){
		display();
		move();
		bounce();
		paddle();
	}

	// Score Text
	fill('#d9c3f7');
	textSize(24);
	text("me " + myScore + '-' + enemyScore + " opponent", 450, 25);
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
	if (xBall < 10 || xBall > 600 - 10) {
			xSpeed *= -1;
		}

	// Triggert Ballseitenwechsel verschickt die ID und die X Pos des Balls
	if (yBall < 10 ) {
		// uncomment below to make multiplayer
		socket.emit("triggerid", id);
		socket.emit("getX", xBall);
		ySpeed *= -1;
	}
		
	// Triggert Punkt
	if (yBall > 600 + 20) {
		ySpeed *= -1;
		socket.emit('score', enemyScore);
		socket.emit('scoreid', id);

		// Automatic ball reset
/* 		yBall = 50;
		xBallRndStart = xBallRndStart = Math.floor(Math.random() * window.innerWidth/2) + window.innerWidth/4;
		xBall = xBallRndStart;
		xSpeed = 0;
		ySpeed = 3; */
	}
}

	// Socket sendet ID von dem Spieler der gerade den Ball abgiebt
	socket.on("triggerid", function(triggerid){
		if (triggerid != id) {
			isplaying = true;
			// Holt sich neue X Position des Balls damit der Übergang zum nächsten Spieler auch schön geschmeidig ist
			socket.on("getX", function(newX){
				xBall = newX;
			})
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
		fill('#00FF00');
		e = ellipse(xBall, yBall, 20, 20);
	}
	
	// Hier wird der Bounce zwischen dem Ball und dem Paddle verwaltet
	function paddle() {
		if ((xBall > mouseX - 40 && xBall < mouseX + 40) && (yBall + 10 >= 600)) {
			ySpeed *= -1;
		}
	}
	
	// ID wird einmalig zugeteilt und auf Screen ausgegeben
	function getID(){
		socket.once('user', function(msg) {
			id = msg;
			let h5 = createElement('h5', msg);
			h5.style('color', '#00a1d3');
			h5.position(10, 580);
		});
	}
	