//
//  Braitenberg vehicle with FSM support
//

class Bot {

  //======================
  // START OF CONTROLLERS
  //======================

  fsm2(cmd) {
    // fsm2 - you should replace this with your own FSM code

    // initialization
    if (cmd === 'init') {
      this.state = 'aggressiveFast';
      this.counter = 0;
      this.bigEnergy = 0;
      return;
    }

    // update
    this[this.state]();
    this.counter++;
    if (this.sns.deltaEnergy == 5) {
      this.bigEnergy += 1;
    }
    // transition rules
    switch (this.state) {
      /** Case when run into big food. */
      case 'aggressiveFast':
        if (this.sns.collision) {
          this.transitionTo('spin');
          break;
        }
        if (this.sns.deltaEnergy == 5) {
          this.transitionTo('areaRestrictedSearch');
        }
        break;
      /** Case to break out of the sprial. */
      case 'areaRestrictedSearch':
        if (this.bigEnergy % 4 == 0 || this.counter > 400) {
          if (this.counter > 400) {
            this.bigEnergy = 0;
          }
          this.transitionTo('aggressiveFast');
          console.log(this.bigEnergy)
        }
        break;
      /** Case to handle collisons. */
      case 'spin':
        if (this.counter > 15 && this.bigEnergy % 4 == 0) {
          this.transitionTo('aggressiveFast');
          break;
        }
        if (this.counter > 15){
          this.transitionTo("areaRestrictedSearch");
          break;
        }
        break;
    }
  }

  randint() {
    return random() > 0.5 ? 1 : 0;
  }

  areaRestrictedSearch() {
    var val = this.genes[0];
    val = 40
    this.mtr.left = val;
    this.mtr.right = -randomGaussian(val, val/2);
  }

  aggressive() {
    // aggressive - crossed excitation
    this.mtr.left = 3 + 20 * this.sns.right;
    this.mtr.right = 3 + 20 * this.sns.left;
  }

  aggressiveFast() {
    // run fast with aggressive algorithm.
    this.mtr.left = this.genes[1] + this.genes[2] * this.sns.right;
    this.mtr.right = this.genes[1] + this.genes[2] * this.sns.left;
  }

  fsm1(cmd) {
    // fsm1 - bot wanders until it hits a wall, then spins

    // initialization
    if (cmd === 'init') {
      this.state = 'wander';
      this.counter = 0;
      return;
    }

    // update
    this[this.state]();
    this.counter++;

    // transition rules
    switch (this.state) {
      case 'wander':
        if (this.sns.collision) this.transitionTo('spin');
        break;
      case 'spin':
        if (this.counter > 15) this.transitionTo('wander');
        break;
    }
  }

  spiral() {
    // you will need to change this code to make it useful
    this.mtr.left = 5;
    this.mtr.right = 0.02 * (itick % 200);
  }

  spin() {
    this.mtr.left = 2;
    this.mtr.right = -2;
  }

  wander() {
    let rn = 20 * random(-1, 1);
    this.mtr.left = 2 + rn;
    this.mtr.right = 2 - rn;
  }

  //======================
  // END OF CONTROLLERS
  //======================

  constructor() {
    this.dia = 25;
    this.cfill = 'darkOrange';
    this.genes = [15, 30, 200];
    this.bigEnergy = 0;
    this.reset();
  }

  consume() {
    this.sns.deltaEnergy = 0.0;
    let bx = this.x; // bot x
    let by = this.y; // bot y
    let rsq = bot.dia * bot.dia / 4;
    for (let i = pellets.length - 1; i >= 0; i--) {
      if ((pellets[i].x - bx) * (pellets[i].x - bx) + (pellets[i].y - by) * (pellets[i].y - by) < rsq) {
        this.energy += pellets[i].value; // bot "eats" the pellet, gains energy
        this.sns.deltaEnergy += pellets[i].value; // sense change in energy
        pellets.splice(i, 1); // delete the pellet
      }
    }
  }

  display() {
    // Braitenberg bugs
    push();
    translate(this.x, this.y);
    // text labels
    noStroke();
    fill(0);
    let xtxt = 20;
    let ytxt = 20;
    textAlign(LEFT);
    if (this.x > 0.8 * width) {
      xtxt = -20;
      textAlign(RIGHT);
    }
    if (this.y > 0.8 * height) {
      ytxt = -20;
    }

    let controllerString = this.controllerName;
    if (this.controllerName.substring(0, 3) === "fsm") { // FSM
      controllerString += ": " + this.state;
    }
    text(controllerString, xtxt, ytxt);
    var energyString = "energy: " + nf(this.energy, 0, 0);
    text(energyString, xtxt, ytxt + 15);

    // draw body
    stroke(0);
    fill(this.cfill);
    ellipse(0, 0, this.dia);
    // draw head
    rotate(this.heading);
    ellipse(12, 0, 8, 12);
    // eyes
    fill(0);
    ellipse(14, 5, 4);
    ellipse(14, -5, 4);

    pop();
  }


  reset() {
    this.x = width / 2;
    this.y = height / 2;
    this.heading = 0;
    this.energy = 0;
    this.state = ''; // FSM
    this.counter = 0; // FSM

    this.sns = {
      left: 0, // activation level for left sensor
      right: 0, // activation level for right sensor
      collision: false, // true = hit wall/obstacle,
      deltaEnergy: 0, // energy gained on last time step
    };

    this.mtr = {
      left: 0, // activation level for left motor
      right: 0 // activation level for right motor
    };

    let cname = select("#controller").value();
    this.setController(cname);
  }


  update() {

    this.updateSensors();

    // constrain after updating sensors to allow collision detection
    let r = this.dia / 2;
    this.x = constrain(this.x, r, width - r);
    this.y = constrain(this.y, r, height - r);

    this.consume();

    this.controller();

    let newSpeed = constrain((this.mtr.left + this.mtr.right) / 2.0, -5.0, 5.0);
    this.heading += constrain((this.mtr.left - this.mtr.right) / this.dia, -0.2, 0.2);
    this.heading %= TWO_PI;
    this.x += newSpeed * cos(this.heading);
    this.y += newSpeed * sin(this.heading);

  }

  updateSensors() {

    let bx = this.x;
    let by = this.y;
    let r = this.dia / 2;
    this.sns.collision = (bx < r) || (bx > width - r) || (by < r) || (by > height - r);

    this.sns.left = 0;
    this.sns.right = 0;

    // compute sensor locations
    let dr = 0.7 * this.dia; // sensor from center of bot
    let dtheta = PI / 4; // angle relative to midline
    let xL = bx + dr * Math.cos(this.heading - dtheta);
    let yL = by + dr * Math.sin(this.heading - dtheta);
    let xR = bx + dr * Math.cos(this.heading + dtheta);
    let yR = by + dr * Math.sin(this.heading + dtheta);

    let ux = Math.cos(this.heading);
    let uy = Math.sin(this.heading);

    for (let p of pellets) {
      let distp = Math.sqrt((p.x - this.x) * (p.x - this.x) + (p.y - this.y) * (p.y - this.y));
      let dotprod = (p.x - this.x) * ux + (p.y - this.y) * uy;
      let cosang = dotprod / distp;

      if (cosang > 0.5) {
        let distLsq = (p.x-xL)*(p.x-xL) + (p.y-yL)*(p.y-yL);
        if (distLsq < 1) distLsq = 1;
        let distRsq = (p.x-xR)*(p.x-xR) + (p.y-yR)*(p.y-yR);
        if (distRsq < 1) distRsq = 1;

        this.sns.left += p.intensity / distLsq;
        this.sns.right += p.intensity / distRsq;
      }
    }
  }


  setController(name) {
    this.controllerName = name;
    this.controller = this[name];
    if (name.substring(0, 3) === 'fsm') { // FSM
      this.controller('init');
    }
  }

  transitionTo(state) { // FSM
    this.counter = 0;
    this.state = state;
  }

}
