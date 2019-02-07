// HW04 template - kinesis

var paused = false;
var itick; // simulation clock
var averageTemp; // Average temperature at each frame.
var world; // the environment (provides temperature info)
var bots; // The array that holds the bots objects.
var NUM_BOTS = 100;

function setup() {
  createCanvas(400, 300).parent("#canvas");
  world = new World();
  bots = new Array();
  for (var i = 0; i < NUM_BOTS; i++) {
    var temp = new Bot();
    bots.push(temp);
  }
  reset();
}

function draw() {

  // update (with warp speed and termination check)
  // do not change this section of the code
  let count = select("#warp").checked() ? 20 : 1;
  if (!paused) {
    for (let i = 0; i < count; i++) {
      update();
      if (itick >= 2000) {
        stop();
        break;
      }
    }
  }

  // you can make changes below this point
  world.display();
  /** Draw each bot in the array. */
  averageTemp = 0;
  for (let bot of bots) {
    bot.draw();
    averageTemp += bot.tsense;
  }
  averageTemp = averageTemp / NUM_BOTS;
  averageTemp = averageTemp.toFixed(3);
  // text display
  noStroke();
  fill(220, 200);
  rect(0, 0, width, 18);
  textSize(15);
  fill(0);
  textAlign('left');
  text(itick, 5, 15);
  textAlign('center');
  text('mean Temp = ' + averageTemp, width / 2, 15);
  textAlign('right');
  text(select("#controller").value(), width - 5, 15);
}

function reset() {
  stop();
  itick = 0;
  /** Reset each bot in the array. */
  for (let bot of bots) {
    bot.reset();
  }
  draw();
}

function update() {
  itick++;
  /** Update all bots. */
  for (let bot of bots) {
    bot.update();
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

function calcStats(adata) {
  // return the mean and standard deviation of data in an array (adata)
  // the return value should be a javascript object with properties mean and std
  // Example:
  //   if you call stats = calcStats([0, 1, 2])
  //   then stats.mean should be 1
  //   and stats.std should be 1
  //
  var mean = 0;
  var std = 0;
  for (let i of adata) {
    mean += i;
  }
  mean = mean / mean.length;

  for (let i of adata) {
    std += (i - mean) * (i - mean);
  }
  std = std / mean.length;
  std = Math.pow(std, 0.5);

  return {
    mean,
    std
  }
}
