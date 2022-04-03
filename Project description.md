# SUPERPOOONG

The idea was to create a multiplayer pong game where the game runs on multiple devices, connects the players to a lobby and lets them play against each other for the highest score.
We did connect the clients to the server over WebSockets.

To play locally [node.js](https://nodejs.org/en/) needs to be installed on your computer.

Start server by writing in the command line `node server.js`

Current version online on Heroku: [https://multiscreenapp.herokuapp.com/](https://multiscreenapp.herokuapp.com/)
# Technologies we used
### Serverside
* Socket.IO
* Node.js
* Heroku

### Languages
* JavaScript
* HTML
* CSS

### Collaboration
* GitHub
* Slack

### Design
* Figma

# The Start
![alt text](https://github.com/Nizii/pong/blob/main/imgs/start.PNG)
# Enter your Name
![alt text](https://github.com/Nizii/pong/blob/main/imgs/enterName.PNG)
# The Game
![alt text](https://github.com/Nizii/pong/blob/main/imgs/game.PNG)
# Rules
* The player with the highest score wins.
* The duration of the game is 120 sec.
* The goal is to hit the green or the white balls with the paddle to get points.
* Avoid contact with the red or black balls. 
* You can also hit the balls with the bottom of the paddle to speed up the balls. The balls will bounce off the ground.
* But hitting the ball with the bottom of the paddle doesn't change your score.


# Score Overview
* Green +3
* White +1
* Red   -3
* Black clears your score to zero

# The Resultscreen
![alt text](https://github.com/Nizii/pong/blob/main/imgs/rank.PNG)
To get to the start screen you have to wait 8 seconds or refresh the browser.

# Architecture
