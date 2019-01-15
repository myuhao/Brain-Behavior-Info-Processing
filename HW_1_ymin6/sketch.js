// HW01 template - simple movement

var paused = false;
var itick; // simulation clock
var bot = new Bot(400, 400); // bot object

function setup() {
  createCanvas(400, 400).parent("#canvas");
  reset();
  bot.draw();
}

function draw() {
  if (!paused) update();
  background('lightBlue');
  fill(0);
  noStroke();
  text('tick = ' + itick, 15, 15);

  console.log(bot.x)
}

function reset() {
  stop();
  itick = 0;
  draw();
}

function update() {
  itick++;
}

function run() {
  paused = false;
  loop();
}

function stop() {
  paused = true;
  noLoop();
}
