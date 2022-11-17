'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode_1 = require("vscode");
const cssCompletionItemProvider_1 = require("./cssCompletionItemProvider");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    let provider = new cssCompletionItemProvider_1.CssCompletionItemProvider();
    context.subscriptions.push(vscode_1.workspace.onDidSaveTextDocument((e) => {
        if (e.languageId === 'css') {
            provider.refreshCompletionItems();
        }
    }));
    context.subscriptions.push(vscode_1.languages.registerCompletionItemProvider('html', provider));
    context.subscriptions.push(vscode_1.languages.registerCompletionItemProvider('cshtml', provider));
    context.subscriptions.push(vscode_1.languages.registerCompletionItemProvider('php', provider));
    context.subscriptions.push(vscode_1.languages.registerCompletionItemProvider('vue', provider));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map