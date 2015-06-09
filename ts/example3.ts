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

	export interface Bar extends Foo {
		id: number
	}

	export function Bloop(a: Bar): void {
		dsl.reflect(a, 'Bar');
	}
}

var a = Object.create(null);
a.id = "hello";
a.val = 42;
//a.x = 10;

Blegh.Bloop(a);