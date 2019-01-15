// HW01 template - simple movement

/** @type {Boolean} If we should pause the animation. */
var paused = false;
/** @type {Number} Simulation clock. */
var itick = 0;
/** @type {Bot Object} The bot that is moving. */
var bot = new Bot();

function setup() {
  createCanvas(400, 400).parent("#canvas");
  reset();
}

function draw() {
  if (!paused) update();
  background('lightBlue');
  fill(0);
  noStroke();
  text('tick = ' + itick, 15, 15);
  bot.draw();
}

/**
 * RESET botton in html.
 * Reset the canvas.
 * 1. tick is set to 0;
 * 2. bot object is reset using its class method.
 */
function reset() {
  stop();
  itick = 0;
  bot.reset();
  draw();
}

/**
 * Update the position of the bot.
 * 1. update the tick number.
 * 2. update the bot position using its class method.
 */
function update() {
  itick++;
  bot.update();
}

/**
 * RUN botton in html.
 */
function run() {
  paused = false;
  loop();
}

/**
 * STOP botton in html.
 */
function stop() {
  paused = true;
  noLoop();
}

