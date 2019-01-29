/**
 * A simple class representing a food pellet.
 */
class Pellet {
	constructor(c="darkGreen", r=3) {
		this.color = c;
		this.radius = r;
		this.x = random(0, width);
		this.y = random(0, height);
	}
}
