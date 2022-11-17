'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const JavascriptConversor_1 = require("./JavascriptConversor");
function activate(context) {
    let disposable = vscode.commands.registerTextEditorCommand('extension.convertHTMLtoString', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let selection = editor.selection;
        let range = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
        let text = editor.document.getText(selection);
        const jsConverTool = new JavascriptConversor_1.default();
        let newString = jsConverTool.convert(text);
        editor.edit(function (editBuilder) {
            editBuilder.replace(range, newString);
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map