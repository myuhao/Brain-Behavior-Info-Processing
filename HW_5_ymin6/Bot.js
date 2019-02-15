class Bot {

  constructor(x = random(width), y = random(height)) {
    // THIS CODE IS OK, NO CHANGES
    this.x = x;
    this.x0 = this.x;
    this.y = y;
    this.y0 = this.y;
    this.major = 25;
    this.minor = 15;
    this.cfill = 'grey';
    this.reset();
  }

  reset() {
    // THIS CODE IS OK, NO CHANGES
    this.x = this.x0;
    this.y = this.y0;
    this.heading = random(TWO_PI);
    this.snsL = 0;
    this.snsR = 0;
    this.mtrL = 0;
    this.mtrR = 0;
    switch (select("#controller").value()) {
      case 'aggressive':
        this.cfill = 'red';
        break;
      case 'coward':
        this.cfill = 'yellow';
        break;
      case 'explorer':
        this.cfill = 'magenta';
        break;
      case 'love':
        this.cfill = 'blue';
    }
  }

  controller() {
    this.updateSensors();

    // EDIT THE CODE BELOW TO IMPLEMENT BRAITENBERG CONTROLLERS
    // Each controller must use just 2 lines of code.
    // Do not use "if" statements in your code
    // Each controller must agree with Braitenberg's description
    // (crossed vs uncrossed, excitation vs inhibition)
    switch (select("#controller").value()) {
      case 'aggressive':
        // earn points for hitting the light
        // OFFSET = 5.
        // GAIN = 10.
        this.mtrL = 5 + 10 * this.snsR;
        this.mtrR = 5 + 10 * this.snsL;
        break;
      case 'coward':
        this.mtrL = 1;
        this.mtrR = 0;
        break;
      case 'explorer':
        this.mtrL = -1;
        this.mtrR = 1;
        break;
      case 'love':
        // uncrossed inhibition
        this.mtrL = 1;
        this.mtrR = 1;
        break;
    }
  }

  update() {
    // THIS CODE IS OK, NO CHANGES
    this.controller();

    let newSpeed = constrain((this.mtrL + this.mtrR) / 2.0, -5.0, 5.0);
    let turnAngle = constrain((this.mtrL - this.mtrR) / this.minor, -0.1, 0.1);

    this.heading += turnAngle;
    this.heading %= TWO_PI;

    this.x += newSpeed * cos(this.heading);
    this.y += newSpeed * sin(this.heading);

    // wrapped boundary conditions
    this.x = (this.x + width) % width;
    this.y = (this.y + height) % height
  }

  updateSensors() {
    // THIS CODE IS OK, NO CHANGES
    this.snsL = 0;
    this.snsR = 0;
    let dr = mag(this.major, this.minor); // distance from center of bot
    let dtheta = atan2(this.minor, this.major); // angle relative to midline
    let xL = this.x + dr * cos(this.heading - dtheta);
    let yL = this.y + dr * sin(this.heading - dtheta);
    let xR = this.x + dr * cos(this.heading + dtheta);
    let yR = this.y + dr * sin(this.heading + dtheta);
    for (let i = 0; i < world.lights.length; i++) {
      let light = world.lights[i];
      let distL = max(1, dist(light.x, light.y, xL, yL));
      let distR = max(1, dist(light.x, light.y, xR, yR));
      let inten = max(0, light.intensity); // ignore negative values
      this.snsL += inten / sq(distL);
      this.snsR += inten / sq(distR);
    }
  }

  draw() {
    // THIS CODE IS OK, NO CHANGES

    push();
    translate(this.x, this.y);
    rotate(this.heading);

    //draw "wheels"
    stroke(150, 200);
    strokeWeight(0.3 * this.minor);
    line(-0.5 * this.major, 0.8 * this.minor, -0.1 * this.major, 0.8 * this.minor);
    line(-0.5 * this.major, -0.8 * this.minor, -0.1 * this.major, -0.8 * this.minor);

    // draw axle
    strokeWeight(1);
    line(-0.3 * this.major, 0.8 * this.minor, -0.3 * this.major, -0.8 * this.minor);

    // draw "body"
    fill(this.cfill);
    ellipse(0, 0, this.major, this.minor);

    // draw "sensors"
    fill(150);
    ellipse(this.major / 2, this.minor / 2, this.minor / 3);
    ellipse(this.major / 2, -this.minor / 2, this.minor / 3);
    pop();
  }

}
