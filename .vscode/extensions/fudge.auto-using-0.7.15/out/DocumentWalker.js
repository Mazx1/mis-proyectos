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
const Constants_1 = require("./Constants");
class DocumentWalker {
    constructor(document) {
        this.document = document;
    }
    /**
     * @param completionPos The position at which the user is currently typing
     * Travels through the document to see what type of completion should appear right now.
     * @returns CompletionType.REFERENCE if a list of references should show,
     * CompletionType.EXTENSION if the extension methods of a type should show, and CompletionType.NONE if no completions should appear.
     *
     */
    getCompletionType(completionPos) {
        return __awaiter(this, void 0, void 0, function* () {
            if (completionPos.character === 0 && completionPos.line === 0)
                return CompletionType.REFERENCE;
            let currentPos = this.getPrev(completionPos);
            let currentChar = this.getChar(currentPos);
            // Travel to before this word
            while (!Constants_1.isWhitespace(currentChar) && !(currentPos.character == 0 && currentPos.line == 0)) {
                if (currentChar === ".") {
                    return CompletionType.EXTENSION;
                }
                if (Constants_1.syntaxChars.includes(currentChar))
                    return CompletionType.REFERENCE;
                currentPos = this.getPrev(currentPos);
                currentChar = this.getChar(currentPos);
            }
            currentPos = this.walkBackWhile(currentPos, Constants_1.isWhitespace);
            if (this.getChar(currentPos) === ".")
                return CompletionType.EXTENSION;
            let wordRegex = /([^\s]+)/;
            let wordBefore = this.document.getText(this.document.getWordRangeAtPosition(currentPos, wordRegex));
            let lastCharOfWordBefore = wordBefore.slice(-1);
            if (Constants_1.syntaxChars.includes(lastCharOfWordBefore))
                return CompletionType.REFERENCE;
            else if (Constants_1.showSuggestFor.includes(wordBefore))
                return CompletionType.REFERENCE;
            return CompletionType.NONE;
        });
    }
    /**
     * @param completionPos The position at which the user is currently typing
     * @returns The hover string of the type that should be extended
     */
    getMethodCallerHoverString(completionPos) {
        return __awaiter(this, void 0, void 0, function* () {
            let typePos = yield this.getTypeInfoPosition(completionPos);
            let hoverString = this.getHoverString(typePos);
            return hoverString;
        });
    }
    /**
     * Skips lines that have preprocessor statements
     */
    getUsingPosition() {
        let line = 0;
        let firstCharInLine;
        do {
            let currentPos = new vscode.Position(line, 0);
            currentPos = this.skipSpaces(currentPos);
            firstCharInLine = this.getChar(currentPos);
            line++;
        } while (firstCharInLine == '#' || Constants_1.isWhitespace(firstCharInLine));
        return new vscode.Position(line - 1, 0);
    }
    skipSpaces(pos) {
        let currentChar = this.getChar(pos);
        while (Constants_1.isWhitespace(currentChar)) {
            let [oldLine, oldChar] = [pos.line, pos.character];
            pos = this.getNext(pos);
            // This the last char in the document
            if (oldChar == pos.character && oldLine == pos.line)
                break;
            currentChar = this.getChar(pos);
        }
        return pos;
    }
    /**
     * Travels through the document to see where exactly is the variable that is trying to invoker a method.
     * This could also be a method call. Examples:
     * x.F   <--- completionPos is after f, we are looking for x.
     * x.Foo(bar).b <--- completionPos is after b, we are looking for Foo.
     * @param completionPos The position in which the user is typing
     * @returns The position of the method or variable that is trying to invoke a method
     */
    getTypeInfoPosition(completionPos) {
        return __awaiter(this, void 0, void 0, function* () {
            let startOfCaller = this.walkBackWhile(completionPos, Constants_1.isWhitespace);
            let dotPos = this.walkBackWhile(startOfCaller, char => char !== ".");
            let aBitAfterEndOfWordBefore = this.walkBackWhile(dotPos, Constants_1.isWhitespace);
            if (aBitAfterEndOfWordBefore.line === 0 && aBitAfterEndOfWordBefore.character === 0)
                return aBitAfterEndOfWordBefore;
            let endOfWordBefore = this.getPrev(aBitAfterEndOfWordBefore);
            if (endOfWordBefore.line === 0 && endOfWordBefore.character === 0)
                return endOfWordBefore;
            // If there are brackets we need to check if it's because of a chained method call or because of redundant parentheses
            if (this.getChar(endOfWordBefore) === ")") {
                let bracketsThatNeedToBeClosed = 1;
                let methodCallPos = this.walkBackWhile(this.getPrev(endOfWordBefore), (char) => {
                    if (char === ")")
                        bracketsThatNeedToBeClosed++;
                    if (char === "(")
                        bracketsThatNeedToBeClosed--;
                    return bracketsThatNeedToBeClosed > 0;
                });
                // Chained method call
                if ((yield this.getHover(methodCallPos)).length > 0) {
                    return methodCallPos;
                }
                // Redundant parentheses
                else {
                    let variablePos = this.walkBackWhile(endOfWordBefore, char => char === ")");
                    return variablePos;
                }
            }
            else {
                return endOfWordBefore;
            }
        });
    }
    /**
     * Reduces the position of startingPosition (walks back) as long the condition is met.
     */
    walkBackWhile(startingPosition, condition) {
        let currentPos = startingPosition;
        let currentChar = this.getChar(currentPos);
        while (condition(currentChar)) {
            currentPos = this.getPrev(currentPos);
            currentChar = this.getChar(currentPos);
            if (currentPos.line === 0 && currentPos.character === 0)
                break;
        }
        return currentPos;
    }
    /**
     * @returns The hover string in a position
     */
    getHoverString(position) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the hover info of the variable from the C# extension
            let hover = yield this.getHover(position);
            if (hover.length === 0)
                return undefined;
            return hover[0].contents[0].value;
        });
    }
    /**
     * @returns All hover info in a position
     */
    getHover(position) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield vscode.commands.executeCommand("vscode.executeHoverProvider", this.document.uri, position));
        });
    }
    /**
     * Returns the character at a position in the document
     */
    getChar(pos) {
        return this.document.getText(new vscode.Range(pos, pos.translate(0, 1)));
    }
    /**
     * Returns the position before another position in the document
     */
    getPrev(pos) {
        if (pos.character === 0 && pos.line === 0)
            throw new Error("Attempt to get position before (0,0)!");
        return this.document.positionAt(this.document.offsetAt(pos) - 1);
    }
    /*
     * Returns the position before another position in the document
     */
    getNext(pos) {
        return this.document.positionAt(this.document.offsetAt(pos) + 1);
    }
    filterByTypedWord(completionPosition, references) {
        return __awaiter(this, void 0, void 0, function* () {
            let wordToComplete = '';
            let range = this.document.getWordRangeAtPosition(completionPosition);
            if (range) {
                wordToComplete = this.document.getText(new vscode.Range(range.start, completionPosition)).toLowerCase();
            }
            let matcher = (f) => f.name.toLowerCase().indexOf(wordToComplete) > -1;
            let found = references.filter(matcher);
            return found;
        });
    }
    /**
     * @param document The text document to search usings of
     * @returns A list of the namespaces being used in the text document
     */
    getUsings() {
        return __awaiter(this, void 0, void 0, function* () {
            let regExp = /^using.*;/gm;
            let matches = this.document.getText().match(regExp);
            if (matches === null)
                return [];
            return Promise.all(matches.map((using) => __awaiter(this, void 0, void 0, function* () {
                let usingWithSC = using.split(" ")[1];
                return usingWithSC.substring(0, usingWithSC.length - 1);
            })));
        });
    }
}
exports.DocumentWalker = DocumentWalker;
var CompletionType;
(function (CompletionType) {
    CompletionType[CompletionType["NONE"] = 0] = "NONE";
    CompletionType[CompletionType["REFERENCE"] = 1] = "REFERENCE";
    CompletionType[CompletionType["EXTENSION"] = 2] = "EXTENSION";
})(CompletionType = exports.CompletionType || (exports.CompletionType = {}));
//# sourceMappingURL=DocumentWalker.js.map