class Bot {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = width - 50;
    this.y = height / 2;
    this.r = 20;
    this.heading = PI / 2;
    this.speed = 3;
    this.energy = 0;
  }

  update() {
    this.heading = this.heading + 0.02 + random(-0.05, 0.05);
    this.x += this.speed * cos(this.heading);
    this.y += this.speed * sin(this.heading);

    //Make it bounce here. Too lazy to implement...
  }

  consume() {
    // bot consumes pellets if pellet center overlaps with bot
    // consumed pellets increase bot energy by 1 unit
    // consumed pellets are moved to a new random location
    this.energy++;
  }

  draw() {
    // add code to draw the bot
    fill('yellow');
    ellipse(this.x, this.y, 2 * this.r);
    stroke(0);
    line(this.x, this.y,
      this.x + this.r * cos(this.heading),
      this.y + this.r * sin(this.heading));
  }
}
