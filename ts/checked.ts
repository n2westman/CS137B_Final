// Final Project Examples
// Nick Westman

import dsl = require('./dsl');

module ls {
	export interface Foo {
		bar: string;
		bar2 ?   : Foo2;
		awesome(first, second: Foo2): void;
		//baz?: string;
	}

	export interface Foo2 {
		s: string;
		david: number;
	}

	export interface Alex {
		x: number
		y: number
		r?: (boop: any) => number
	}

	export interface index {
		[name: string]: Foo;
	}

	export interface list {
		[index: number]: Foo2;
	}

	export function Hello(): void {
		console.log("Hello World");

		var a = new Example();
	}

	export interface Foo2 {
		extrafield: string;
	}

	export class Example implements Foo {
		//private x: any = {};

		public bar = "";
		public bar2 = null;
		public baz = "";

		constructor() {
			this.bar = "Hello";
			this.baz = "World";

			//this["bar"] = "Hello";

			return this;
		}

		public awesome(first, second: Foo2): void {

		}
	}
}

ls.Hello();