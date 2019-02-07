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
    this.memory = this.tsense; // Initialize to the start temperature.
  }

  update() {
    this.controller(); // sets this.speed and this.turnAngle
    this.heading += this.turnAngle;
    this.x += this.speed * cos(this.heading);
    this.y += this.speed * sin(this.heading);
    // wrapped boundary conditions here
    this.x = (this.x + width) % width;
    this.y = (this.y + height) % height;
    this.memory = this.tsense; // Store the temp from the last tick.
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
        // this.speed = this.tsense;
        this.speed = stepPositive(this.tsense);
        this.turnAngle = 0.1 * random(-1, 1);
        break;
      case 'orthokinesisNeg':
        // bot speed decreases with temperature
        // this.speed = 1 - this.tsense;
        this.speed = stepNegative(this.tsense);
        this.turnAngle = 0.1 * random(-1, 1);
        break;
      case 'run-tumble':
        // bot tumbles if temperature is decreasing
        // otherwise it goes straight
        this.speed = 1;
        if (this.tsense <= this.memory) {
          this.turnAngle = Math.PI * random(-1, 1);
        } else {
          this.turnAngle = 0;
        }
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

/**
 * A step size function for positive orthokinesis.
 * @param  {float} temperature The current temperature between 0 to 1.
 * @return {int}             1 if the temerature is over threshold, 0 otherwise.
 */
function stepPositive(temperature) {
  var threshold = 0.25;
  if (temperature > threshold) {
    return 1;
  } else {
    return 0;
  }
}

/**
 * A step size function for negative orthokinesis.
 * @param  {float} temperature The current temperature between 0 to 1.
 * @return {int}             1 if the temerature is below threshold, 0 otherwise.
 */
function stepNegative(temperature) {
  var threshold = 0.75;
  if (temperature < threshold) {
    return 1;
  } else {
    return 0;
  }
}
