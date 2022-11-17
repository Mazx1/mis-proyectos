'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.CssCompletionItemProvider = void 0;
const vscode = require("vscode");
const cssAggregator_1 = require("./cssAggregator");
class CssCompletionItemProvider {
    constructor() {
        this.refreshCompletionItems();
    }
    provideCompletionItems(document, position, token) {
        let lineUntilPosition = document.getText(new vscode.Range(position.with(undefined, 0), position));
        let textAfterClassAttributeStart = lineUntilPosition.substr(lineUntilPosition.lastIndexOf('class='));
        let attributeClosed = textAfterClassAttributeStart.search(/class=(?:\"[a-zA-Z0-9-\s]*\"|\'[a-zA-Z0-9-\s]*\'|.*[=>])/);
        if (textAfterClassAttributeStart.length > 1 && attributeClosed === -1) {
            return this.completionItems;
        }
        else {
            return Promise.reject("Not inside html class attribute.");
        }
    }
    refreshCompletionItems() {
        this.completionItems = cssAggregator_1.default().then(cssClasses => cssClasses.map(cssClass => new vscode.CompletionItem(cssClass)));
    }
}
exports.CssCompletionItemProvider = CssCompletionItemProvider;
;
//# sourceMappingURL=cssCompletionItemProvider.js.map