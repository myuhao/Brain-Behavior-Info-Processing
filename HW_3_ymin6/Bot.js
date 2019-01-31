class Bot {
  constructor() {
    this.reset();
  }

  reset() {
    // uncomment and replace with appropriate initial values
    this.x = width - 50;
    this.y = height / 2;
    this.r = 20;
    this.heading = PI * 2;
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
    this.updateVelocity();
    let nextX = this.x + this.vx;
    let nextY = this.y + this.vy;
    // Handle collision to wall by reflection.
    if (nextX < this.r || nextX > (width-this.r)) {
      this.vx *= -1;
      nextX= this.x;
    }
    if (nextY < this.r || nextY > (height-this.r)) {
      this.vy *= -1;
      nextY = this.y;
    }
    this.x = nextX;
    this.y = nextY;
    // Update the heading to reflect collision.
    this.heading = atan(this.vy/this.vx);
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
