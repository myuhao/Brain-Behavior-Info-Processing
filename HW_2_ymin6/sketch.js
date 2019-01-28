// HW02 template - simple foraging 

var paused = false;
var itick; // simulation clock
var bot; // bot object
var botEnergy;
var foodLoc;

function setup() {
  createCanvas(400, 400).parent("#canvas");
  bot = new Bot();
  // foodLoc = new Array();
  // for (i = 0; i < width; i++) {
  //   temp = new Array();
  //   for (j = 0; j < height; j++) {
  //     temp[j] = false;
  //   }
  //   foodLoc[i] = temp;
  // }
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
  for (var coord in foodLoc) {
    fill("darkGreen");
    ellipse(coord[0], coord[1], 6);
    console.log(coord[0], coord[1], coord);
  }
}

function reset() {
  stop();
  itick = 0;
  botEnergy = 0;
  bot.reset();
  draw();
  foodLoc = {};
  for (i = 0; i < 100; i++) {
    x = random(0, width);
    y = random(0, height);
    coord = [x, y];
    foodLoc[coord] = true;
  }
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