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
        noStroke()
        if (this.color === 'red') {
            fill('#C94B45');
            circle(this.x, this.y, this.size);
        } else if (this.color === 'green') {
           fill('#769355');
           circle(this.x, this.y, this.size);
        } else if (this.color === "white") {
            fill('#fff');
            circle(this.x, this.y, this.size);
        } else {
            //fill('#303030')
            stroke('#000');
            strokeWeight(1);
            noFill()
            circle(this.x, this.y, this.size-2);
            noStroke()
            fill('#58221f');
            circle(this.x, this.y, this.size-10);
        }
    }

    update() {
        this.x = this.x + this.xSpeed;
        this.y = this.y + this.ySpeed;
    }
}