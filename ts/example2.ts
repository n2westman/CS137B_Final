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
Blegh.Bloop(<Blegh.Foo>a);