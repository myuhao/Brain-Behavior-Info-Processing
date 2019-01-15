class Bot {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = 400 - 50;
    this.y = 400 / 2;
    this.r = 20;
    this.heading = Math.PI/2;
    this.speed = 3;
    this.rgb = [255, 255, 0];
  }

  update() {
    // add code so bot moves in a circle of diameter 300 pixels
    // do not use the 'itick' variable in your code
    this.x += 1;
  }

  draw() {
    // add code to draw the bot
    fill(this.rgb[0], this.rgb[1], this.rgb[2]);
    stroke(0);
    ellipse(this.x, this.y, 2 * this.r);
    line(this.x,
      this.y,
      this.x + this.r*cos(this.heading),
      this.y + this.r*sin(this.heading));
  }
}
