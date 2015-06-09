//Example 7 - index typechecking

import dsl = require('./dsl');

interface Node {
	value: string;
}

interface NodeArray {
	[index: number]: Node,
	pos: number,
	end: number,
	length: number,
	extra?: number|string
}

interface NodeHash {
	[index: string]: Node,
}

function iterate(arr: NodeArray, callback: (n: Node) => void): void {
	dsl.reflect(arr, "NodeArray");
	for (var i = 0; i < arr.length; i++){
		callback(arr[i]);
	}
}

function iterateHash(a: NodeHash, callback: (n: Node) => void): void {
	dsl.reflect(a, "NodeHash");
	for (var key in a) {
		if(a.hasOwnProperty(key)) {
			callback(a[key]);
		}
	}
}

var a: NodeArray = { pos: 55, end: 81, length: 0 };
a[0] = { value: "first" };
a[1] = Object.create({});
a[2] = { value: "third" };
a.length = 3;

try {
	iterate(a, function(n: Node) { console.log(n.value); });
} catch (e) {
	console.log("Reflection example failed on object: " + JSON.stringify(a));
	console.log(e.message);
}

var b: NodeHash = {};
b["first"] = { value: "first" };
b[1] = Object.create({});
b[2] = { value: "third" };

try {
	iterateHash(b, function(n: Node) { console.log(n.value); });
} catch (e) {
	console.log("Reflection example failed on object: " + JSON.stringify(b));
	console.log(e.message);
}


