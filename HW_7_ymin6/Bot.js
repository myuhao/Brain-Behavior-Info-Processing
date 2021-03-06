class Bot {
  constructor() {
    this.reset();
    this.genes = [];
  }

  controller() {
    // Edit to match the specification in INSTRUCTIONS
    // Check for genes length.
    if (this.genes.length != 4) {
      throw "Genes number not matching!";
      return;
    }
    // Define the constants:
    let tau = this.genes[0];
    tau = tau != 0 ? tau : Number.MIN_VALUE; // Use underflow limit as 0 to handle DIVISION_BY_ZERO
    let alpha = this.genes[1];
    let beta = this.genes[2];
    let gamma = this.genes[3];
    /**
     * Update using the following rules:
     *   1) sensory interneuron (this.v) update rule: this.v += (this.sns - this.v)/g[0]
     *   2) premotor neuron (this.w) update rule: this.w = g[1]*this.sns + g[2]*this.v + g[3]
     *   3) motor output (controls turning): this.heading += constrain(this.w, 0, 0.1)
     */
     this.v += (this.sns - this.v)/tau;
     this.w = alpha*this.sns + beta*this.v + gamma;
     this.heading += constrain(this.w, 0, 0.1);
     return;
  }

  reset() {
    this.x = width / 2;
    this.y = 40;
    this.heading = random(TWO_PI);
    this.dia = 20;
    this.sns = 0;
    this.v = 0;
    this.w = 0;
    this.fitness = 0;
    // worm body specification
    this.nseg = 5;
    this.segLen = 8;
    this.xseg = [];
    this.yseg = [];
    this.hseg = [];
    // start in slightly curled body position
    this.xseg[0] = this.x;
    this.yseg[0] = this.y;
    this.hseg[0] = this.heading;

    for (let i = 1; i < this.nseg; i++) {
      this.hseg[i] = this.hseg[i - 1] + (i / this.nseg);
    }

    // use flipped heading for positioning body segments
    for (let i = 1; i <= this.nseg; i++) {
      let flipped = this.hseg[i - 1] + PI;
      this.xseg[i] = this.xseg[i - 1] + this.segLen * cos(flipped);
      this.yseg[i] = this.yseg[i - 1] + this.segLen * sin(flipped);
    }
  }

  updateSensors() {
    let dx = (this.x - attractant.x);
    let dy = (this.y - attractant.y);
    let rSq = dx * dx + dy * dy;
    let sigmaSq = attractant.sigma * attractant.sigma;
    this.sns = attractant.peak * Math.exp(-rSq / (2 * sigmaSq));
  }

  update() {
    this.updateSensors();
    this.controller();

    this.x += cos(this.heading);
    this.y += sin(this.heading);

    bot.fitness += bot.sns / attractant.peak;

    // start in slightly curled body position
    this.xseg[0] = this.x;
    this.yseg[0] = this.y;
    this.hseg[0] = this.heading;
    // update body segment headings
    for (var i = 1; i < this.nseg; i++) {
      this.hseg[i] += 0.1 * diffAngle(this.hseg[i - 1], this.hseg[i]);
    }

    // use flipped heading for positioning body segments
    for (let i = 1; i <= this.nseg; i++) {
      let flipped = this.hseg[i - 1] + PI;
      this.xseg[i] = this.xseg[i - 1] + this.segLen * cos(flipped);
      this.yseg[i] = this.yseg[i - 1] + this.segLen * sin(flipped);
    }
  }

  display() {
    // Braitenberg bugs
    stroke('orange');
    for (let i = 0; i < this.nseg; i++) {
      strokeWeight(2.5 * (1 - i / this.nseg) + 0.5);
      line(this.xseg[i], this.yseg[i], this.xseg[i + 1], this.yseg[i + 1]);
    }
  }

}
