
function runGenetic() {
    let population = new bruteForce();
    population.runAllParameters()
}

class bruteForce {
    constructor() {
        this.popSize = 100;
        this.bots = [];
        for (let i = 0; i < 4; i++) {
            let ars = [];
            for (let j = 0; j < 5; j++) {
                let offset = []
                for (let k = 0; k < 10; k++) {
                    offset[k] = new Bot();
                    offset[k].genes[2] = k * 40;
                    offset[k].genes[1] = j * 6;
                    offset[k].genes[0] = 15;
                }
                ars[j] = offset;
            }
            this.bots[i] = ars;
        }
    }

    runAllParameters() {
        let currMax = 0;
        let bestGene = [];
        for (let i = 0; i < this.bots.length; i++) {
            for (let j = 0; j < this.bots[i].length; j++) {
                for (let k = 0; k < this.bots[i][j].length; k++) {
                    bot.genes = this.bots[i][j][k].genes;
                    let score = evaluateScore();
                    if (score > currMax) {
                        currMax = score;
                        bestGene = bot.genes;
                    }
                }
            }
        }
        console.log(currMax);
        console.log(bestGene);
    }
}

function evaluateScore() {
    select("#controller").value("fsm2")
    data = []
    for (let i = 0; i < NTRIALS; i++) {
        simReset();
        for (let j = 0; j < NSTEPS; j++) {
            simStep();
        }
        data.push(bot.energy);
    }
    stats = calcArrayStats(data);
    return stats.mean;
}
