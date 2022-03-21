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
        //push();
        //translate(this.x, this.y);
        fill(this.colorHue,60,100);
        circle(this.x, this.y, this.size);
        //pop();
    }

    update() {
        this.x = this.x + this.xSpeed;
        this.y = this.y + this.ySpeed;
    }
}