/// <reference path="../lib/definitions/node.d.ts" />
/// <reference path="../lib/definitions/typescriptServices.d.ts" />
var fs = require('fs');
var ts = require('typescript');
var _ = require('underscore');

var interfaces = {};

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

function incrementNodesAfter(node, distance, start){
    if (node.pos >= start) {
        node.pos += distance;
    }
    if (node.end > start) {
        node.end += distance;
    }

    ts.forEachChild(node, function(node) {
        incrementNodesAfter(node, distance, start);
    });
}

function incrementAllNodes(node, toAdd) {
    node.pos += toAdd;
    node.end += toAdd;

    ts.forEachChild(node, function(node) {
        incrementAllNodes(node, toAdd);
    });
}

function insertSubTree(main, sub, index) {
    main.nodeCount += sub.nodeCount;
    _.extend(main.identifiers, sub.identifiers)
    main.identifierCount = Object.keys(main.identifiers).length;

    incrementNodesAfter(main, sub.end, index);
    incrementAllNodes(sub, index);

    if (main.SyntaxKind === ts.SyntaxKind.SourceFile) {
        main.endOfFileToken.pos += sub.end;
        main.endOfFileToken.end += sub.end;
    }

    //Putting statements together
    main.text = main.text.substring(0, index) + sub.text + main.text.substring(index);
    mergeStatements(main.statements, sub.statements);
    main.statements.end = main.statements[main.statements.length-1].end;
}

//merge list l2 into l1
function mergeStatements(l1, l2){
    var temp = [];
    while(l1.length && l2.length) {
        if(l1[0].pos < l2[0].pos) {
            temp.push(l1.shift());
        } else {
            temp.push(l2.shift());
        }
    }
    while(l1.length) {
        temp.push(l1.shift());
    }
    while(l2.length) {
        temp.push(l2.shift());
    }
    console.log(temp);
    temp.forEach(function(s) {
        l1.push(s);
    })

}

const fileNames = process.argv.slice(2);
fileNames.forEach(function (fileName) {
    // Parse a file
    var program = ts.createProgram([fileName], {
        outDir: fileName.replace("ts", "build").replace(/\..*$/, ''),
        module: 1,
    });
    var sourceFile = program.getSourceFile(fileName);
    //var extra = ts.createSourceFile("blah", "console.log(\"Hello World\");var ex = 3;");

    //console.log(sourceFile);

    //insertSubTree(sourceFile, extra, sourceFile.statements[3].end);

    //console.log(sourceFile);
    //console.log(sourceFile.statements[sourceFile.statements.length-1].declarationList);

    scrapeInterfaces(sourceFile, fs.readFileSync(fileName, 'utf8'));

    var newOutput = ts.createSourceFile("ts/interfaces.ts", "export var interfaces: any = " + JSON.stringify(interfaces, null, '  ') + ";\n", 1 /* ES5 */, true);
    var interfacesFile = program.getSourceFile("ts/interfaces.ts");
    
    for (var key in interfacesFile) { //Use JS pointers to rewrite the data structure. Prints out a proper interfaces file.
      if (interfacesFile.hasOwnProperty(key)) {
        interfacesFile[key] = newOutput[key];
      }
    }

    var emitResult = program.emit();
    var allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

    allDiagnostics.forEach(function( diagnostic) {
        var obj = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start); //{line, character}
        var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        console.log(diagnostic.file.fileName + '(' + (obj.line + 1) + ', ' + (obj.character +1) + '): ' + message);
    });
});
