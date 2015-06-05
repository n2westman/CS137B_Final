/// <reference path="../../lib/definitions/tslint.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoOptionalParametersWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "optional parameters forbidden: ";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoOptionalParametersWalker = (function (_super) {
    __extends(NoOptionalParametersWalker, _super);
    function NoOptionalParametersWalker() {
        _super.apply(this, arguments);
    }
    NoOptionalParametersWalker.prototype.visitPropertySignature = function (node) {
        // create a failure at the current position
        if (node.questionToken !== undefined) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + node.name.text));
        }
        // call the base version of this visitor to actually parse this node
        _super.prototype.visitPropertySignature.call(this, node);
    };
    NoOptionalParametersWalker.prototype.visitTypeLiteral = function (node) {
        console.log(node);
        _super.prototype.visitTypeLiteral.call(this, node);
    };
    return NoOptionalParametersWalker;
})(Lint.RuleWalker);
