// Final Project Examples
// Nick Westman

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
		r?: () => number
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