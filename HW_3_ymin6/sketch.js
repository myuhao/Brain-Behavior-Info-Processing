// HW03 template - wandering

var paused = false;
var itick; // simulation clock
var bot; // bot object
var pellets; // pellets array
const NPELLETS = 100;

function setup() {
  createCanvas(400, 400).parent("#canvas");
  bot = new Bot();
  pellets = [];
  for (let i = 0; i < NPELLETS; i++) pellets[i] = new Pellet();
  figure(1);
  xlabel('wanderNoise');
  ylabel('energy per tick');
  xlim(0, 2.0);
  ylim(0, 0.1);
  reset();
}

function draw() {
  let count = select("#warp").checked() ? 100 : 1;
  if (!paused)
    for (let i = 0; i < count; i++) update();

  // only drawing commands below this point
  background('lightBlue');
  for (let p of pellets) p.draw();
  bot.draw();
  fill(220);
  noStroke();
  rect(0, 0, 100, 50);
  fill(0);
  text('tick = ' + itick, 15, 15);
  text('energy = ' + bot.energy, 15, 30);
  text('e/tick = ' + nfc(bot.energyPerTick, 3), 15, 45);
}

function setNoise() {
  bot.wanderNoise = select("#noise").value();
  console.log("bot.wanderNoise = " + bot.wanderNoise);
}

function addPoint() {
  if (bot.energyPerTick) {
    console.log(nfc([bot.wanderNoise, bot.energyPerTick], 3));
    plot(bot.wanderNoise, bot.energyPerTick, 'bo');
  } else {
    console.log('error: bot.energyPerTick does not exist');
  }
}

function reset() {
  stop();
  itick = 0;
  bot.reset();
  for (let p of pellets) p.reset();
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

/** Attempt to one button simulate the plot */
function simulation() {
  // Clear figure.
  clf();
  var stepSize = select("#stepSize").value();
  stepSize = parseFloat(stepSize);
  // Simulate each wanderNoise.
  for (var n = 0; n <= 2; n += stepSize) {
    plotNoise(n);
  }
}

/**
 * Plot the energyPerTick at given wanderNoise.
 * @param  {float} noise wanderingNoise to be simulated.
 * @return {NULL}
 */
function plotNoise(noise) {
  // Reset the canvas and bot.
  reset();
  // Set the bot wandering noise and the duration of simulation.
  bot.wanderNoise = noise;
  var duration = select("#duration").value();
  duration = parseFloat(duration);
  // Simulate.
  for (var i = 0; i < duration; i++) {
    update();
  }
  stop();
  plot(bot.wanderNoise, bot.energyPerTick, 'bo');
}
