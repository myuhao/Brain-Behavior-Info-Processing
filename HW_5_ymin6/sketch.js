var itick = 0; // simulation time
var paused = true; // simulation run/pause status
var validID = false;

var bots = [];
const NBOTS = 4;

var world; // the environment

function draw() {
  if(!paused) update();
  
  if(world.scoring.passed || itick >= 1000) stop();
  
  if (!validID) {
    background(0);
    fill('red');
    textSize(40);
    text("Enter a valid ID in index.html", 20, height/2);
    return;
  }

  world.draw(); // draws the light and scoring rings
  // draw bots
  for (let b of bots) {
    b.draw();
    b.trail.draw();
  }

  textSize(14);
  noStroke();
  fill('white');
  textAlign(LEFT);
  text("score: " + nf(world.scoring.total,0,2), 10, 15);
  textAlign(RIGHT);
  text(itick, width-10, 15);
  textAlign(CENTER);
  text(select("#controller").value(), width/2, 15);

}


function setup() { // called once at beginning to setup simulation
  createCanvas(600, 400).parent("#canvas");
  world = new World();
  
  for (let i = 0; i < NBOTS; i++) {
    let r = 50 + 50 * i;
    let angle = PI / 4 + i * HALF_PI;
    let x = width / 2 + r * cos(angle);
    let y = height / 2 + r * sin(angle);
    bots.push(new Bot(x, y));
  }
  
  for (let b of bots) b.trail = new Trail(150, b.cfill);
  
  // adjust light intensity
  let val = int(select("#studentID").value());
  if(val >= 0 && val <= 999){
    validID = true;
    let inten = int(10 + val);
    console.log("Light intensity: " + inten);
    world.lights[0].intensity = inten;
  }
  
  reset();
}

function reset() {
  stop();
  itick = 0;
  for (let b of bots) {
    b.reset();
    b.trail = new Trail(150, b.cfill);
  }
  world.scoring.reset();
  draw();
}

function update() {
  itick++;
  for (let b of bots) {
    b.update();
    b.trail.update(b.x, b.y);
  }
  world.update();
}

function run() {
  paused = false;
  loop();
}

function stop() {
  paused = true;
  noLoop();
}