import dsl = require("./dsl");

export interface Point {
	x: number,
	y: number
}

var a: Point = { x: 4, y: 5 };
delete a.x;

dsl.reflect(a, "Point");