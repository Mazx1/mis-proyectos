"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const testUtil_1 = require("./testUtil");
const Constants_1 = require("../Constants");
class DirectCompletionTestHelper {
    constructor(completionProvider) {
        this.completionProvider = completionProvider;
    }
    directlyComplete(testName, line, character) {
        return __awaiter(this, void 0, void 0, function* () {
            let completions = (yield this.directlyCompleteWithData(testName, line, character))[0];
            return completions.map(item => removeCheat(item.label));
        });
    }
    directlyCompleteWithData(testName, line, character) {
        return __awaiter(this, void 0, void 0, function* () {
            let doc = yield testUtil_1.openTest(testName);
            let pos = new vscode.Position(line, character);
            let token = new vscode.CancellationTokenSource().token;
            let completionContext = { triggerCharacter: ".", triggerKind: vscode.CompletionTriggerKind.Invoke };
            let completions = yield this.completionProvider.provideCompletionItems(doc, pos, token, completionContext);
            return [completions, doc];
        });
    }
}
exports.DirectCompletionTestHelper = DirectCompletionTestHelper;
function removeCheat(label) {
    return label.replace(Constants_1.SORT_CHEAT, "");
}
exports.removeCheat = removeCheat;
function complete(testName, line, character) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield completeWithData(testName, line, character))[0].items.map(item => removeCheat(item.label));
    });
}
exports.complete = complete;
function completeWithData(testName, line, character) {
    return __awaiter(this, void 0, void 0, function* () {
        let doc = yield testUtil_1.openTest(testName);
        let completions = (yield vscode.commands.executeCommand("vscode.executeCompletionItemProvider", doc.uri, new vscode.Position(line, character), "."));
        let char = doc.getText(new vscode.Range(new vscode.Position(line, character), new vscode.Position(line, character + 1)));
        return [completions, doc];
    });
}
exports.completeWithData = completeWithData;
//# sourceMappingURL=TestCompletionUtil.js.map