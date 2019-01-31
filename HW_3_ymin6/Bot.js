class Bot {
  constructor() {
    this.reset();
  }

  reset() {
    // uncomment and replace with appropriate initial values
    this.x = width - 50;
    this.y = height / 2;
    this.r = 20;
    this.heading = PI / 2;
    this.speed = 3;
    this.energy = 0;
    this.wanderNoise = select("#noise").value();
    this.energyPerTick = 0;
  }

  update() {
  }

  consume() {
    for (let p of pellets) {
      if (dist(p.x, p.y, this.x, this.y) < this.r) {
        this.energy += 1.0;
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
}
