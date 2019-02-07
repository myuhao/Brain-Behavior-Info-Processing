class Bot {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = random(height);
    this.heading = random(TWO_PI);
    this.r = 6;
    this.speed = 0;
    this.turnAngle = 0;
    this.tsense = world.getTemperature(this.x, this.y);
    this.memory = 0; // for the run-tumble controller
  }

  update() {
    this.controller(); // sets this.speed and this.turnAngle
    this.heading += this.turnAngle;
    this.x += this.speed * cos(this.heading);
    this.y += this.speed * sin(this.heading);
    // wrapped boundary conditions here
    this.x = (this.x + width) % width;
    this.y = (this.y + height) % height
  }

  controller() {
    // get the temperature at the bot's location
    this.tsense = world.getTemperature(this.x, this.y);

    // default values for speed and turnAngle
    this.speed = 0;
    this.turnAngle = 0.1;
    
    // switch controller based on menu setting
    switch (select("#controller").value()) {
      case 'wander':
        this.speed = 1;
        this.turnAngle = random(-0.3, 0.3);
        break;
      case 'orthokinesisPos':
        // bot speed increases with temperature
        this.speed = this.tsense;
        this.turnAngle = 0.1 * random(-1, 1);
        break;
      case 'orthokinesisNeg':
        // bot speed decreases with temperature
        this.speed = 1 - this.tsense;
        this.turnAngle = 0.1 * random(-1, 1);
        break;
      case 'run-tumble':
        // bot tumbles if temperature is decreasing
        // otherwise it goes straight
        break;
    }
  }

  draw() {
    // draw the bot
    push()
    translate(this.x, this.y);
    rotate(this.heading);
    noStroke();
    fill('bisque');
    ellipse(0, 0, 2 * this.r, this.r);
    stroke(0);
    line(0, 0, this.r, 0);
    pop();
  }
}