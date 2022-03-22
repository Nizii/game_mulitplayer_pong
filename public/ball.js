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
        fill(this.color);
        circle(this.x, this.y, this.size);
    }

    update() {
        this.x = this.x + this.xSpeed;
        this.y = this.y + this.ySpeed;
    }
}