//Example 4 - Checking the type of each property
import dsl = require('./dsl');

export module types {
	export interface Name {
		value: string
	}

	export interface Point {
		x: number;
		y: number;
		name: Name;
	}

	export interface ColoredPoint {
		p: Point;
		color: string;
	}

	export function BluePoint(): ColoredPoint {
		var a = <any>{};
		return { p: a, color: "blue" }; //Insert constract happen
	}
}

var b = types.BluePoint();

try {
	dsl.reflect(b, "ColoredPoint"); //We take on good faith that we get a ColoredPoint. Do we?
	b.p.name.value; //Error! But we never get here.
} catch (e) {
	console.log(e.message);
	console.log("Should never get to that chained undefined error right there");
} 