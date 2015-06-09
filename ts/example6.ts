//Example 6 - Function Type Checking

import dsl = require('./dsl');

interface Foo {
	v(): void;
}

function check(item: Foo) {
	dsl.reflect(item, "Foo");
}

var a = {v: function(arg) { } };

check(a);