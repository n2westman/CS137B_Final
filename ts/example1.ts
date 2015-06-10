//Example 1 - Property Deletion

import dsl = require("./dsl");

export interface Point {
	x: number,
	y: number
}

var a: Point = { x: 4, y: 5 };
delete a.x;

try {
	dsl.reflect(a, "Point");
} catch (e) {
	console.log("Properly Caught Bad Interface");
	console.log(e.message);
}