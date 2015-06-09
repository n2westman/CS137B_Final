/// <reference path="../lib/definitions/node.d.ts" />
/// <reference path="../lib/definitions/typescriptServices.d.ts" />
var fs = require('fs');
var ts = require('typescript');

var interfaces = {};
var once = 0;

function scrapeInterfaces(sourceFile, fileString) {
    scrapeNode(sourceFile);
    
    function scrapeNode(node) {
        //console.log(node.kind);
        if(node.kind === ts.SyntaxKind.InterfaceDeclaration) {
            interfaces[node.name.text] = interfaces[node.name.text] || {};

            /**
             * I apologize for the syntax of these for loops. It's not fair to the reader.
             * Whoever had the bright idea to invent a type which crossed a list and a dictionary in javascript, I abhor you.
             * These loops are hacky and ignore the true structure of the (array - dictionary hybrid) that stands after this.
             * Whoever at microsoft who had the idea to invent the following type baffles me.
             * interface NodeArray<T> extends Array<T>, ts.TextRange {}
             * Whoever wrote that code, I really disagree with your decision. It makes your compiler AST impossible to work with.
             * I know it's likely because of the desire to sourcemap, which is cool and all, but your solution is a pain.
             **/

            if(node.heritageClauses) { //extends clauses.  
                var extendList = interfaces[node.name.text]["_extends"] = interfaces[node.name.text]["_extends"] || [];
                for(var i = 0; i < node.heritageClauses.length; i++) {
                    //console.log(node.heritageClauses[i]);
                    for(var j = 0; j < node.heritageClauses[i].types.length; j++) {
                        var extending = node.heritageClauses[i].types[j].expression.text;
                        if(extendList.indexOf(extending) === -1) {
                            extendList.push(extending);
                        }
                    }
                }
            }

            

            node.members.forEach(function(member) { 
                processMember(member, node.name.text);
            });
            if(once === 0) {
                allSubsequentNodes(node);
                once = 1;
            }
        }
        ts.forEachChild(node, scrapeNode);
    }

    function processMember(member, iname) {
        var name = fileString.substring(member.pos, member.type.pos-1).trim(); //Name string. Can be tricky.
        var question = name.slice(-1) === '?';
        name = name.replace(/\?/g,'').trim();
        var obj = {optional: question}

        switch (name.slice(-1)) {
            case ']':
                var decomposed = name.replace(/[\[\]]/g, '').split(':');
                obj.indexType = decomposed[1].trim();
                name = decomposed[0].trim();
                obj.propertyType = "index";
                break;
            case ')':
                obj.parameters = [];
                member.parameters.forEach(function (parameter) {
                    obj.parameters.push(parameter.name.text);
                });
                name = name.split('(')[0];
                obj.propertyType = "function";
                break;
            default:
                obj.propertyType = "property";
                break;
        }

        obj.type = fileString.substring(member.type.pos, member.type.end).trim(); //Property / Return type.
        if (obj.type[0] == '(') { //anon function type
            obj.propertyType = "function";

            obj.parameters = [];
            member.type.parameters.forEach(function (parameter) {
                obj.parameters.push(parameter.name.text);
            });
            var split = obj.type.split(">");
            obj.type = split[split.length-1].trim();
        }


        interfaces[iname][name] = obj;
    }
}

function allSubsequentNodes(node) {
    console.log("here");
    if(!node.parent) {
        return;
    }

}

const fileNames = process.argv.slice(2);
fileNames.forEach(function (fileName) {
    // Parse a file
    var program = ts.createProgram([fileName], {
        outDir: fileName.replace("ts", "build").replace(/\..*$/, ''),
    });
    var sourceFile = program.getSourceFile(fileName);
    // delint it
    scrapeInterfaces(sourceFile, fs.readFileSync(fileName, 'utf8'));

    var newOutput = ts.createSourceFile("ts/interfaces.ts", "exports.interfaces = " + JSON.stringify(interfaces, null, '  ') + ";\n", 1 /* ES5 */, true);
    var interfacesFile = program.getSourceFile("ts/interfaces.ts");
    
    for (var key in interfacesFile) { //Use JS pointers to rewrite the data structure. Prints out a proper interfaces file.
      if (interfacesFile.hasOwnProperty(key)) {
        interfacesFile[key] = newOutput[key];
      }
    }

    program.emit();
});
