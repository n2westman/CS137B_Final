//Example 5 - Optional Parameters

import dsl = require('./dsl');

interface Point {
	x: number
	y: number
	name?: string
}

function UsePoint(p: Point): void {
	dsl.reflect(p, "Point");
	//Rest of function
}

UsePoint({ x: 4, y: 5, name: "First"} );
UsePoint({ x: 3, y: 4 });