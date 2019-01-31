class Bot {
  constructor() {
    this.reset();
  }

  reset() {
    // uncomment and replace with appropriate initial values
    this.x = width - 50;
    this.y = height / 2;
    this.r = 20;
    this.heading = 3*PI/4;
    this.speed = 3;
    this.vx = this.speed * cos(this.heading);
    this.vy = this.speed * sin(this.heading);
    this.energy = 0;
    this.wanderNoise = select("#noise").value();
    this.energyPerTick = 0;
  }

  update() {
    /** Deal with the movement here. */
    // this.heading += random(-this.wanderNoise, this.wanderNoise);
    let vx = cos(this.heading);
    let vy = sin(this.heading);
    let nextX = this.x + this.speed * vx;
    let nextY = this.y + this.speed * vy;

    if (nextX <= this.r || nextX >= width-this.r) {
      vx *= -1;
      nextX = this.x;
      // this.heading = Math.atan(vy / vx);
    }
    if (nextY <= this.r || nextY >= height-this.r) {
      vy *= -1;
      nextY = this.y;
      this.heading = Math.atan(vy / vx);
    }
    this.x = nextX;
    this.y = nextY;

    console.log(this.heading);
    /** Eat the food!! */
    this.consume();
    this.energyPerTick /= itick;
  }

  consume() {
    for (let p of pellets) {
      if (dist(p.x, p.y, this.x, this.y) < this.r) {
        this.energy += 1.0;
        this.energyPerTick += 1.0;
        p.reset(); // move pellet to new random location
      }
    }
  }

  draw() {
    // add code to draw the bot
    push();
    translate(this.x, this.y);
    rotate(this.heading);
    fill('yellow');
    stroke(0);
    ellipse(0, 0, 2 * this.r);
    stroke(0);
    line(0, 0, this.r, 0);
    pop();
  }

  updateVelocity() {
    this.vx = this.speed * cos(this.heading);
    this.vy = this.speed * sin(this.heading);
  }
}
