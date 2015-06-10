//Example 6 - Function Type Checking

import dsl = require('./dsl');

interface Foo {
	v(): void;
	w?: string;
}

function check(item: Foo) {
	dsl.reflect(item, "Foo");
}

var a = {v: function(arg) { }, w: "Hi" };

try {
	check(a); //v is a proper type of function
} catch (e) {
	console.log("Here");
}

a.v = function() { };
delete a.w; //Doesn't matter if this guy is gone

try {
	check(a); //Checks out
} catch (e) {
	console.log("Not Here");
}

delete a.v; //v is gone. Should be a bad thing!

try {
	check(a);
} catch (e) {
	console.log("Here");
}