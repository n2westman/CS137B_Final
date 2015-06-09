//Extending an interface

import dsl = require('./dsl');

interface Foo {
	x: number
}

interface Bar extends Foo {
	y: number
}
function check(y: Bar): void {
	dsl.reflect(y, "Bar");
}

var a = Object.create({});
a.y = 5;

try {
	check(a);
} catch (e) {
	console.log("Reflection Successfully Caught the error!");
	console.log(e.message);
}

a.x = 3;

try {
	check(a);
} catch (e) {
	console.log("We should not hit here");
	console.log(e.message);
}
