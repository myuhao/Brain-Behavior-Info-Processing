function check_prey() {
  
  select("#out").html(''); //clear
  
  noLoop();
  let saveWiring = preyWiring;
  preyWiring = true;
  makeConnections();
  
  let nunits = units.length;
  let mtrL = units[nunits-2];
  let mtrR = units[nunits-1];
  
  // prey midline
  light.x = 300;
  light.y = 100;
  for(let i=0; i<150; i++) draw();
  console.log('prey midline', mtrL.angular_vel, mtrR.angular_vel);
  assert(mtrL.angular_vel > 0.05, 'prey midline, ML > 0.05');
  assert(mtrL.angular_vel < 0.15, 'prey midline, ML < 0.15');
  assert(mtrR.angular_vel > 0.05, 'prey midline, MR > 0.05');
  assert(mtrR.angular_vel < 0.15, 'prey midline, MR < 0.15');
  assert(abs(mtrL.angular_vel - mtrR.angular_vel) < 0.05, 'prey midline, ML/MR balanced');
  
  select("#out").html('\n', true);
  
  light.x = 100;
  light.y = 100;
  for(let i=0; i<150; i++) draw();
  console.log('prey left lateral', mtrL.angular_vel, mtrR.angular_vel);
  assert(mtrL.angular_vel < 0.05, 'prey left lateral, ML < 0.05');
  assert(mtrR.angular_vel > 0.20, 'prey left lateral, MR > 0.20');
  assert(mtrR.angular_vel < 0.80, 'prey left lateral, MR < 0.80');
  
  select("#out").html('\n', true);
  
  light.x = 500;
  light.y = 100;
  for(let i=0; i<150; i++) draw();
  console.log('prey right lateral', mtrL.angular_vel, mtrR.angular_vel);  
  assert(mtrL.angular_vel > 0.20, 'prey right lateral, ML > 0.20');
  assert(mtrL.angular_vel < 0.80, 'prey right lateral, ML < 0.80');
  assert(mtrR.angular_vel < 0.05, 'prey right lateral, MR < 0.05');
  
  // restore
  preyWiring = saveWiring;
  makeConnections();
  select("#out").html('DONE', true);
  loop();
}

function check_predator() {

  select("#out").html(''); //clear
  
  noLoop();
  let saveWiring = preyWiring;
  preyWiring = false;
  makeConnections();
  
  let nunits = units.length;
  let mtrL = units[nunits-2];
  let mtrR = units[nunits-1];
  
  // predator SL8
  light.x = 270;
  light.y = 100;
  for(let i=0; i<150; i++) draw();
  console.log('predator near SL8', mtrL.angular_vel, mtrR.angular_vel);
  assert(mtrL.angular_vel > 0.20, 'predator near SL8, ML > 0.20');
  assert(mtrL.angular_vel < 0.80, 'predator near SL8, ML < 0.80');
  assert(mtrR.angular_vel < mtrL.angular_vel, 'predator near SL8, MR < ML');
  
  select("#out").html('\n', true);
  
  // predator SL1
  light.x = 100;
  light.y = 100;
  for(let i=0; i<150; i++) draw();
  console.log('predator near SL1', mtrL.angular_vel, mtrR.angular_vel);
  assert(mtrL.angular_vel < 0.20, 'predator near SL1, ML < 0.20');
  assert(mtrR.angular_vel < mtrL.angular_vel, 'predator near SL1, MR < ML');
  
  
  
  // restore
  preyWiring = saveWiring;
  makeConnections();
  select("#out").html('DONE', true);
  loop();
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