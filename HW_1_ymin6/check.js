function check() {

  select("#out").html(''); //clear

  // make sure bot exists
  if (!assert(typeof(bot) === 'object', 'bot exists')) return;
  
  // make sure bot x, y, heading exist
  if (!assert('x' in bot, 'bot x exists')) return;
  if (!assert('y' in bot, 'bot y exists')) return;
  if (!assert('heading' in bot, 'bot heading exists')) return;

  // check initial state
  let x0 = width - 50;
  let y0 = height / 2;
  let heading0 = PI / 2;

  reset();
  assert(approx(bot.x, x0), 'initial x location');
  assert(approx(bot.y, y0), 'initial y location');
  assert(approx(bot.heading, heading0), 'initial heading');

  // single step test
  bot.update();
  let d = dist(bot.x, bot.y, x0, y0);
  assert(approx(d, 3.0), 'step length');
  assert(approx(bot.heading, heading0 + 0.02), 'step delta heading');

  // check final state
  // bot should complete circle in approx 314 step
  reset();
  testloop();

  function testloop() {
    paused = false;
    draw();
    if (itick < 314) {
      window.requestAnimationFrame(testloop);
    } else {
      assert(approx(bot.x, width - 50), 'final x location');
      assert(approx(bot.y, height / 2), 'final y location');
    }
  }
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