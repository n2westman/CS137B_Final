// Final Project Examples
// Nick Westman

module ls {
	export interface Foo {
		bar: string;
		//baz?: string;
	}

	export function Hello(): void {
		console.log("Hello World");

		var a = new Example();
	}

	export class Example implements Foo {
		//private x: any = {};

		public bar = "";
		public baz = "";

		constructor() {
			this.bar = "Hello";
			this.baz = "World";

			//this["bar"] = "Hello";

			return this;
		}
	}
}

ls.Hello();