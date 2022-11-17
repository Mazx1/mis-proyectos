'use strict';
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
const CompletionProvider_1 = require("./CompletionProvider");
const Constants_1 = require("./Constants");
const CSHARP = "csharp";
exports.PROJECT_NAME = "auto-using";
exports.HANDLE_COMPLETION = "extension.handleCompletion";
exports.WIPE_STORAGE_COMMAND = "extension.wipeCommon";
exports.COMPLETION_STORAGE = "commonwords";
exports.PROJECT_ID = "fudge.auto-using";
exports.PREFERENCE_RECIEVED = "preferenceRecieved";
class Completion {
    constructor(label, namespace) {
        this.label = label;
        this.namespace = namespace;
    }
}
exports.Completion = Completion;
function completionCommon(completion, completions) {
    return completions.some(c => c.label === completion.label && c.namespace === completion.namespace);
}
exports.completionCommon = completionCommon;
class TestHelper {
    constructor(context) {
        this.context = context;
        if (this.context === undefined) {
            console.log(this.context);
        }
    }
}
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        exports.testHelper = new TestHelper(context);
        let handleCompletionCommand = vscode.commands.registerCommand(exports.HANDLE_COMPLETION, (reference, line) => __awaiter(this, void 0, void 0, function* () {
            if (reference.namespaces.length > 1) {
                let completions = CompletionProvider_1.getStoredCompletions(context);
                let namespacesSorted = yield Promise.all(reference.namespaces.sort((n1, n2) => {
                    let firstPrio = completionCommon(new Completion(reference.name, n1), completions);
                    let secondPrio = completionCommon(new Completion(reference.name, n2), completions);
                    if (firstPrio && !secondPrio)
                        return -1;
                    if (!firstPrio && secondPrio)
                        return 1;
                    return n1.localeCompare(n2);
                }));
                vscode.window.showQuickPick(namespacesSorted).then(pick => addUsing(pick, context, reference, line));
            }
            else {
                storeCompletion(context, new Completion(reference.name, reference.namespaces[0]));
            }
        }));
        // Remove all stored completions
        let wipeStorageCommand = vscode.commands.registerCommand(exports.WIPE_STORAGE_COMMAND, () => wipeStoredCompletions(context));
        //TODO add this to test helper
        let autoUsingProvider = vscode.languages.registerCompletionItemProvider({ scheme: "file", language: CSHARP }, new CompletionProvider_1.CompletionProvider(context), ".");
        context.subscriptions.push(autoUsingProvider, handleCompletionCommand, wipeStorageCommand);
    });
}
exports.activate = activate;
function wipeStoredCompletions(context) {
    let amount = CompletionProvider_1.getStoredCompletions(context).length;
    vscode.window.showInformationMessage(`Wiped memories of ${amount} references`);
    context.globalState.update(exports.COMPLETION_STORAGE, []);
}
exports.wipeStoredCompletions = wipeStoredCompletions;
function addUsing(pick, context, reference, line) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof pick === "undefined")
            return;
        // Remove invisible unicode char
        if (pick[0] === Constants_1.SORT_CHEAT)
            pick = pick.substr(1, pick.length);
        storeCompletion(context, new Completion(reference.name, pick));
        let editBuilder = (textEdit) => {
            textEdit.insert(new vscode.Position(line, 0), `using ${pick};\n`);
        };
        yield vscode.window.activeTextEditor.edit(editBuilder);
    });
}
exports.addUsing = addUsing;
function storeCompletion(context, completion) {
    let completions = CompletionProvider_1.getStoredCompletions(context);
    if (Array.isArray(completions) && completions[0] instanceof Completion) {
        if (!completionCommon(completion, completions)) {
            completions.push(completion);
            context.globalState.update(exports.COMPLETION_STORAGE, completions);
        }
    }
    else {
        context.globalState.update(exports.COMPLETION_STORAGE, [completion]);
    }
}
exports.storeCompletion = storeCompletion;
//# sourceMappingURL=extension.js.map