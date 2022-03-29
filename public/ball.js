class Ball {
    constructor(x, y, xSpeed, ySpeed, size, ballId, ballType, color) {
        this.x = x;
        this.y = y;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.size = size;
        this.ballId = generateRandomString();
        this.color = color;
        this.ballType = ballType;
    }

    show() {
        //stroke('#000');
        if (this.color === 'red') {
            fill('#C94B45');
        } else if (this.color === 'green') {
           fill('#769355');
        } else if (this.color === "white") {
            fill('#fff');
        } else {
            fill('#000');
        }
        circle(this.x, this.y, this.size);
    }

    update() {
        this.x = this.x + this.xSpeed;
        this.y = this.y + this.ySpeed;
    }
}