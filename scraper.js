/// <reference path="../lib/definitions/node.d.ts" />
/// <reference path="../lib/definitions/typescriptServices.d.ts" />
var fs = require('fs');
var ts = require('typescript');

var interfaces = {};

function scrapeInterfaces(sourceFile, fileString) {
    scrapeNode(sourceFile);
    
    function scrapeNode(node) {
        if(node.kind === ts.SyntaxKind.InterfaceDeclaration) {
            interfaces[node.name.text] = {};
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
        if (obj.type[0] == '(') {
            obj.propertyType = obj.type = "function";
        }
        interfaces[iname][name] = obj;
    }
}



const fileNames = process.argv.slice(2);
fileNames.forEach(function (fileName) {
    // Parse a file
    var sourceFile = ts.createSourceFile(fileName, fs.readFileSync(fileName).toString(), 2 /* ES6 */, true);
    // delint it
    scrapeInterfaces(sourceFile, fs.readFileSync(fileName, 'utf8'));

    console.log("var _interfaces = " + JSON.stringify(interfaces, null, '  ') + ";\n");  
});
