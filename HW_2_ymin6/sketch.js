// HW02 template - simple foraging

var paused = false;
var itick; // simulation clock
var bot; // bot object
var pellets;

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
  text('energy = ' + bot.energy, 15, 30);
  pellets.forEach(drawPellets);
}

function reset() {
  stop();
  itick = 0;
  botEnergy = 0;
  bot.reset();
  /** Handle food pellets */
  pellets = new Array();
  for (i = 0; i < 100; i++) {
    pellets.push(getNewPellet());
  }
  draw();
}

function update() {
  itick++;
  bot.update();
  for (var i = 0; i < pellets.length; i++) {
    var distance = calcDistance(pellets[i]);
    if (distance <= bot.r) {
      bot.consume();
      pellets[i] = getNewPellet();
    }
  }
}

function run() {
  paused = false;
  loop();
}

function stop() {
  paused = true;
  noLoop();
}

/**
 * Calculate the distance between two points.
 */
function calcDistance(p, x=bot.x, y=bot.y) {
  return Math.sqrt((p.x-x)*(p.x-x) + (p.y-y)*(p.y-y));
}

/**
 * Draw all food pellets in an array.
 * @param  {Array} value The coordinates of the food pellet in an array.
 * @return {Null}       Does not return.
 */
function drawPellets(value) {
  fill("darkGreen");
  ellipse(value.x, value.y, 6);
}

/**
 * Get a new pellet that is not in the bot already.
 * @return {Pellet} New food pellet.
 */
function getNewPellet() {
  var newP = new Pellet();
  return calcDistance(newP) > bot.r ? newP : getNewPellet();
}

