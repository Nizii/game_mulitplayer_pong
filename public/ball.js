class Ball {
    constructor(x, y, xSpeed, ySpeed, size, ballId, ballType) {
        this.x = x;
        this.y = y;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.size = size;
        this.ballId = generateRandomString();
        this.ballType = ballType;
    }

    show() {
        fill(this.colorHue,60,100);
        circle(this.x, this.y, this.size);
    }

    update() {
        this.x = this.x + this.xSpeed;
        this.y = this.y + this.ySpeed;
    }
}