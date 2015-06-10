//The danger of any, and split interfaces

import dsl = require("./dsl");

module Blegh {
	export interface Foo {
		id: string,
		val: number,
	}

	export interface Bar extends Foo, Baz {
		x: number
	}

	export interface Baz {
		blah: number
	}

	export interface Foo {
		y: number
	}

	export function Bloop(a: Bar): void {
		dsl.reflect(a, 'Bar');
	}
}

var a: any = {};
a.id = "hello";
a.val = 42;
a.x = 10;
a.blah = 12;

try {
	Blegh.Bloop(a);
} catch (e) {
	console.log(e.message);
} finally {
	console.log("Should have caught an error saying that we're missing property y");
}