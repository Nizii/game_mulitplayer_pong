class Ball {
    constructor(x, y, xSpeed, ySpeed, size, ballId) {
        this.x = x;
        this.y = y;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.size = size;
        this.ballId = generateRandomString();
    }

    show() {
        //push();
        //translate(this.x, this.y);
        circle(this.x, this.y, this.size);
        //pop();
    }

    update() {
        this.x = this.x + this.xSpeed;
        this.y = this.y + this.ySpeed;
    }
}