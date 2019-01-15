class Bot {
  constructor() {
    this.reset();
  }

  Bot(setWidth, setHeight) {
    this.initX = setWidth - 50;
    this.initY = setHeight / 2;
    this.r = 20;
    this.heading = 1.5;
    this.speed = 3;
    this.rgb = [255, 255, 0];
    console.log(this.initX);
  }

  reset() {
    this.x = this.initX;
    this.y = this.initY;
    this.r = 20;
    this.heading = 1.5;
    this.speed = 3;
    this.rgb = [255, 255, 0];
  }

  update() {
    // add code so bot moves in a circle of diameter 300 pixels
    // do not use the 'itick' variable in your code
  }


  draw() {
    // add code to draw the bot
    ellipse(this.x, this.y, this.r);
    fill(this.rgb[0], this.rgb[1], this.rgb[2]);
  }
}
