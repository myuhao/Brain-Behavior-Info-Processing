function check() {

  select("#out").html(''); //clear

  reset();

  // make sure bot and pellets exist
  if (!assert(typeof(bot) === 'object', 'bot exists')) return;
  if (!assert(typeof(pellets) === 'object', 'pellets exist')) return;
  if (!assert(Array.isArray(pellets), 'pellets is an array')) return;
  if (!assert(pellets.length === 100, 'array lenght is 100')) return;

  // make sure bot.energy exists in is initialized to zero
  if (!assert('energy' in bot, 'bot energy exists')) return;
  if (!assert(bot.energy === 0, 'initial bot energy is zero')) return;

  // make sure bot.consume funtion exists
  if (!assert('consume' in bot, 'bot consume method exists')) return;
  if (!assert(typeof(bot.consume === 'function'), 'consume is a function')) return;

  // make sure pellet x and y both exist
  let p = pellets[99];
  if (!assert('x' in p, 'pellet x exists')) return;
  if (!assert('y' in p, 'pellet y exists')) return;

  // check bot initial state
  let x0 = width - 50;
  let y0 = height / 2;
  let heading0 = PI / 2;

  if (!assert(approx(bot.x, x0), 'initial bot x location')) return;
  if (!assert(approx(bot.y, y0), 'initial bot y location')) return;
  if (!assert(approx(bot.heading, heading0), 'initial bot heading')) return;

  // single step test
  bot.update();
  let d = dist(bot.x, bot.y, x0, y0);
  if (!assert(approx(d, 3.0), 'bot step length')) return;
  if (!assert(approx(bot.heading, heading0 + 0.02), 'bot delta heading')) return;

  // bot loop test
  // bot should complete one loop in approx 314 step
  reset();
  for (let i = 0; i < 314; i++) update();
  draw();
  assert(bot.energy > 9 && bot.energy < 50, 'final amount of energy collected');

  select("#out").html('DONE', true);

}

function approx(a, b) {
  let eps = max([0.01 * abs(a), 0.01 * abs(b), 0.01]);
  return abs(a - b) < eps
}

function assert(test, str) {
  return test ? passed(str) : failed(str);
}

function passed(str) {
  select("#out").html(str + ' ... OK\n', true);
  return true;
}

function failed(str) {
  select("#out").html(str + ' ... FAILED\n', true);
  return false;
}