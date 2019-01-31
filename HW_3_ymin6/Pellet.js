class Pellet {
  
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = random(height);
    this.r = 3;
  }

  draw() {
    fill('darkGreen');
    noStroke();
    ellipse(this.x, this.y, 2 * this.r);
  }
}