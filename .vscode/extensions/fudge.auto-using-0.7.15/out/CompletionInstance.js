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
const DataProvider_1 = require("./DataProvider");
const extension_1 = require("./extension");
const util_1 = require("./util");
const DocumentWalker_1 = require("./DocumentWalker");
const Constants_1 = require("./Constants");
const CompletionProvider_1 = require("./CompletionProvider");
const speedutil_1 = require("./speedutil");
function provideCompletionItems(document, position, token, context, extensionContext) {
    return __awaiter(this, void 0, void 0, function* () {
        let completionInstance = new CompletionInstance(extensionContext, new DocumentWalker_1.DocumentWalker(document));
        return completionInstance.provideCompletionItems(document, position, token, context);
    });
}
exports.provideCompletionItems = provideCompletionItems;
class CompletionInstance {
    constructor(context, documentWalker) {
        this.context = context;
        this.documentWalker = documentWalker;
        this.data = new DataProvider_1.DataProvider();
    }
    provideCompletionItems(document, position, token, context) {
        return __awaiter(this, void 0, void 0, function* () {
            let completionType = yield this.documentWalker.getCompletionType(position);
            let completions;
            if (completionType === DocumentWalker_1.CompletionType.NONE) {
                completions = [];
            }
            else {
                let usings = yield this.documentWalker.getUsings();
                let completionData;
                if (completionType === DocumentWalker_1.CompletionType.EXTENSION) {
                    let methodCallerHover = yield this.documentWalker.getMethodCallerHoverString(position);
                    if (methodCallerHover !== undefined) {
                        let methodCallerType = this.parseType(methodCallerHover);
                        completionData = this.getExtensionMethods(methodCallerType);
                    }
                    else {
                        util_1.AUDebug("Could not find method caller type! Assuming it's just a non-existent type followed by a dot.");
                        completionData = [];
                    }
                }
                else if (completionType === DocumentWalker_1.CompletionType.REFERENCE) {
                    completionData = yield this.documentWalker.filterByTypedWord(position, this.data.getReferences());
                }
                completions = this.completionDataToCompletions(completionData, usings);
            }
            return completions;
        });
    }
    /**
     * Takes a omnisharp hover string from when you hover over a type, and returns the type that is written in it.
     */
    parseType(hoverString) {
        const start = 10;
        let typeStart = hoverString.substring(start, hoverString.length);
        let generic = false;
        let i = 0;
        if (hoverString === "") {
            throw Error("unexpected empty hover string");
        }
        for (i = 0; typeStart[i] !== " " && typeStart[i] !== "\n"; i++) {
            if (typeStart[i] === "<") {
                generic = true;
                break;
            }
        }
        let type = typeStart.substr(0, i);
        let typeClass, typeNamespace;
        // If it is a full path return the class and namespace
        if (type.includes(".")) {
            let classAndNamespace = type.split(".");
            typeNamespace = classAndNamespace.slice(0, classAndNamespace.length - 1).join(".");
            typeClass = classAndNamespace.slice(classAndNamespace.length - 1, classAndNamespace.length).join(".");
            // If it is just a class name return just the class
        }
        else {
            typeClass = type;
            typeNamespace = undefined;
        }
        // Is an array type
        if (typeClass[typeClass.length - 1] === "]")
            typeClass = "Array";
        // Convert primitives to objects. I.E. string => String.
        //@ts-ignore
        let typeAsObject = Constants_1.primitives[typeClass];
        if (typeof typeAsObject !== "undefined")
            typeClass = typeAsObject;
        if (generic)
            typeClass += "<>";
        return { class: typeClass, namespace: typeNamespace };
    }
    /**
     * Get all extension methods of a type
     */
    getExtensionMethods(callerType) {
        let classPos = speedutil_1.binSearch(this.data.getHierachies(), callerType.class, ((h1, h2) => h1.localeCompare(h2.class)));
        if (classPos === -1)
            return [];
        let extensibleClasses = this.data.getHierachies()[classPos];
        if (extensibleClasses.namespaces.length === 1) {
            let baseclasses = extensibleClasses.namespaces[0].fathers;
            // Add the class itself to the list of classes that we will get extension methods for.
            let classItselfStr = extensibleClasses.namespaces[0].namespace + "." + callerType.class;
            // Remove generic marker '<>'
            if (classItselfStr[classItselfStr.length - 1] === ">")
                classItselfStr = classItselfStr.substr(0, classItselfStr.length - 2);
            baseclasses.push(classItselfStr);
            let extensions = util_1.flatten(baseclasses.map(baseclass => this.data.getExtensionMethods()[speedutil_1.binSearch(this.data.getExtensionMethods(), baseclass, (str, ext) => str.localeCompare(ext.extendedClass))])
                .filter(obj => typeof obj !== "undefined")
                .map(extendedClass => extendedClass.extensionMethods));
            return extensions;
        }
        else {
            throw new Error("Auto Using does not support ambigous references yet.");
        }
    }
    /**
     * Map pure completion data to vscode's CompletionItem[] format
     * @param usings A list of the using directive in the file. All already imported references will be removed from the array.
     */
    completionDataToCompletions(references, usings) {
        let completionAmount = filterOutAlreadyUsing(references, usings);
        // All references the user has imported before. They will gain a higher priority. 
        let commonNames = CompletionProvider_1.getStoredCompletions(this.context).map(completion => completion.label);
        commonNames.sort();
        let completions = new Array(completionAmount);
        let usingPos = this.documentWalker.getUsingPosition();
        for (let i = 0; i < completionAmount; i++) {
            let reference = references[i];
            let name = reference.name;
            let isCommon = speedutil_1.binarySearch(commonNames, name) !== -1;
            let thereIsOnlyOneClassWithThatName = reference.namespaces.length === 1;
            // We instantly put the using statement only if there is only one option
            let usingStatementEdit = thereIsOnlyOneClassWithThatName ? [usingEdit(reference.namespaces[0], usingPos)] : undefined;
            let completion = {
                label: isCommon ? name : Constants_1.SORT_CHEAT + name,
                insertText: name,
                filterText: name,
                kind: vscode.CompletionItemKind.Reference,
                additionalTextEdits: usingStatementEdit,
                commitCharacters: ["."],
                detail: reference.namespaces.join("\n"),
                command: { command: extension_1.HANDLE_COMPLETION, arguments: [reference, usingPos.line], title: "handles completion" }
            };
            completions[i] = completion;
        }
        return completions;
    }
}
const usingEdit = (namespace, pos) => vscode.TextEdit.insert(pos, `using ${namespace};\n`);
/**
 * Removes all namespaces that already have a using statement
 */
function filterOutAlreadyUsing(references, usings) {
    usings.sort();
    let n = references.length;
    for (let i = 0; i < n; i++) {
        let m = references[i].namespaces.length;
        for (let j = 0; j < m; j++) {
            // Get rid of references that their usings exist
            if (speedutil_1.binarySearch(usings, references[i].namespaces[j]) !== -1) {
                references[i].namespaces[j] = references[i].namespaces[m - 1];
                references[i].namespaces.length -= 1;
                j--;
                m--;
            }
        }
        // Get rid of empty references
        if (references[i].namespaces.length === 0) {
            references[i] = references[n - 1];
            references.length -= 1;
            i--;
            n--;
        }
    }
    return n;
}
//# sourceMappingURL=CompletionInstance.js.map