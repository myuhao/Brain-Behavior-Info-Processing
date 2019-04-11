class Qlearner {
  /**
   * Retrieve the array key corresponding to the largest element in the array.
   * See <https://gist.github.com/engelen/fbce4476c9e68c52ff7e5c2da5c24a28>.
   *
   * @param {Array.<number>} array Input array
   * @return {number} Index of array element with largest value
   */
  argmax(array) {
    return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
  }

  bestAction(state) {
    // return the best action for this state
    return this.argmax(this.Q[state]);
  }

  maxQ(state) {
    // return the maximum Q value for this state
    return this.Q[state][this.bestAction(state)];
  }

  updateQ(state, action, reward, nextState) {
    // implement the Q-learning update rule
    // state, action, reward, and nextState are passed in as arguments
    let nextVal = Math.max(...this.Q[nextState]);
    let thisVal = Math.max(...this.Q[state]);
    this.Q[state][action] += this.alpha * (reward + this.gamma * nextVal - thisVal);
  }
  
  //===================================
  // NOTHING BELOW HERE SHOULD CHANGE
  //===================================


  constructor(nstates, nactions) {
    this.nstates = nstates;
    this.nactions = nactions;

    // create array Q[nstates][nactions]
    this.Q = new Array(nstates);
    for (let i = 0; i < nstates; i++) {
      this.Q[i] = new Array(nactions);
    }

    this.resetQ(); // randomize Q values

    this.gamma = 0.8; // discount factor
    this.epsilon = 0.1; // initial epsilon for epsilon-greedy policy
    this.alpha = 0.01; // learning rate
  }

  resetQ() {
    // reinitialize Q with random weights
    for (let i = 0; i < this.nstates; i++) {
      for (let j = 0; j < this.nactions; j++) {
        this.Q[i][j] = random(-0.001, 0.001); // random init
      }
    }
  }

  actionEpsGreedy(state) {
    // epsilon-greedy policy 
    if (random() < this.epsilon) {
      // pick a random action
      return randint(0, this.nactions - 1);
    } else {
      return this.bestAction(state);
    }
  }
}