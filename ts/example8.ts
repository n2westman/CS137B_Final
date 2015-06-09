//Example 8 - Circular definitions

import dsl = require("./dsl");

interface Foo {
	item: Bar
}

interface Bar {
	item: Baz
}

interface Baz {
	item: Foo
}


var a: Foo = { item: null };
var b: Bar = { item: a };
var c: Baz = { item: b };
a.item = c;

//console.log(a);

dsl.reflect(a, "Foo");