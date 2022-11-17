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
const testUtil_1 = require("./testUtil");
const TestCompletionUtil_1 = require("./TestCompletionUtil");
const mocha_1 = require("mocha");
const vscode = require("vscode");
mocha_1.suite(`CompletionProvider References Tests`, () => {
    //TODO add space tests
    mocha_1.suiteSetup(() => __awaiter(this, void 0, void 0, function* () {
        yield testUtil_1.activateExtension();
    }));
    mocha_1.test("Should show completions", () => __awaiter(this, void 0, void 0, function* () {
        let completionList = yield TestCompletionUtil_1.complete("ShouldShow.cs", 1, 5);
        testUtil_1.assertContains(completionList, "File");
    }));
    mocha_1.test("Should not show completions when not needed", () => __awaiter(this, void 0, void 0, function* () {
        let [completionList, doc] = yield TestCompletionUtil_1.completeWithData("ShouldNotShow.cs", 1, 4);
        testUtil_1.assertNone(completionList.items, (completion) => completion.kind === vscode.CompletionItemKind.Reference);
    }));
    mocha_1.test("Should filter out already used namespaces", () => __awaiter(this, void 0, void 0, function* () {
        let completionList = yield TestCompletionUtil_1.complete("ShouldFilterOut.cs", 4, 4);
        testUtil_1.assertNotContains(completionList, "File");
    }));
    mocha_1.test("Should combine references of the same name", () => __awaiter(this, void 0, void 0, function* () {
        let [completionList] = yield TestCompletionUtil_1.completeWithData("ShouldCombine.cs", 1, 6);
        completionList.items.sort((item1, item2) => item1.label.localeCompare(item2.label));
        let enumerables = completionList.items.filter(c => TestCompletionUtil_1.removeCheat(c.label) === "IEnumerable");
        testUtil_1.assertSize(enumerables, 1);
        let enumerable = enumerables[0];
        testUtil_1.assertStringContains(enumerable.detail, "System.Collections");
        testUtil_1.assertStringContains(enumerable.detail, "System.Collections.Generic");
    }));
});
//# sourceMappingURL=references.test.js.map