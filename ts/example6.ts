//Example 6 - Function Type Checking

import dsl = require('./dsl');

interface Foo {
	v(): void;
}

function Check(item: Foo) {
	dsl.reflect(item, "Foo");
}

var a = Object.create(Object);
a.v = function(arg) { };

Check(a);