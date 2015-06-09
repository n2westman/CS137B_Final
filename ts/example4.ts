import dsl = require('./dsl');

export module types {
	interface Name {
		value: string
	}

	interface Point {
		x: number;
		y: number;
		name: Name;
	}

	interface ColoredPoint {
		p: Point;
		color: string;
	}

	function BluePoint(): ColoredPoint {
		var a = { x: true };
		return { p: a, color: "blue" }; //Insert constract happen
	}

	var b = BluePoint();

	dsl.reflect(b, "ColoredPoint");

	b.p.name.value; //Error!
}