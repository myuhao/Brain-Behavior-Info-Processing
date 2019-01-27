// HW02 template - simple foraging 

var paused = false;
var itick; // simulation clock
var bot; // bot object
var botEnergy;

function setup() {
  createCanvas(400, 400).parent("#canvas");
  bot = new Bot();
  reset();
}

function draw() {
  if (!paused) update();
  background('lightBlue');  
  bot.draw();
  fill(220);
  noStroke();
  rect(0, 0, 100, 40);
  fill(0);
  text('tick = ' + itick, 15, 15);
  text('energy = ' + botEnergy, 15, 30);
}

function reset() {
  stop();
  itick = 0;
  botEnergy = 0;
  bot.reset();
  draw();
}

function update() {
  itick++;
  bot.update();
}

function run() {
  paused = false;
  loop();
}

function stop() {
  paused = true;
  noLoop();
}