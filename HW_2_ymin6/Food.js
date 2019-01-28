class Food {
	constructor (num, c="darkGreen", r=3) {
		this.number = num;
		this.color = c;
		this.radius = r;
		this.pos = {};
		for (i = 0; i < this.number; i++) {
			
		}
	}
	/**
	* Draw one food pallet at given location.
	*/
	draw() {
		fill(this.color);
		ellipse(this.x, this.y, 2*this.radius);
		stroke(0);
	}
}