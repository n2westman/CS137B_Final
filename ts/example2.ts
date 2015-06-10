//Example 2 - type forcing problems
import dsl = require("./dsl");

module Blegh {
	export interface Foo {
		id: string,
		val: number
	}

	export function Bloop(a: Foo): void {
		dsl.reflect(a, 'Foo');
	}
}

var a = { val: 42 };
try {
	Blegh.Bloop(<Blegh.Foo>a);
} catch (e) {
	console.log("Caught Forced Type");
	console.log(e.message);
}