export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "optional parameters forbidden: ";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoOptionalParametersWalker(sourceFile, this.getOptions()));
    }
}

class NoOptionalParametersWalker extends Lint.RuleWalker {
    public visitPropertySignature(node) {
        // create a failure at the current position
        if (node.questionToken !== undefined) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + node.name.text));
        }
        // call the base version of this visitor to actually parse this node
        super.visitPropertySignature(node);
    }
}
