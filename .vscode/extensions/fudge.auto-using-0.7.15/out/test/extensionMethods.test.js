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
const vscode = require("vscode");
const TestCompletionUtil_1 = require("./TestCompletionUtil");
suite(`CompletionProvider Extension Method Tests`, () => {
    suiteSetup(() => __awaiter(this, void 0, void 0, function* () {
        let wait1 = testUtil_1.activateExtension();
        let wait2 = testUtil_1.activateCSharpExtension();
        yield wait1;
        yield wait2;
    }));
    test("Should show extension methods", () => __awaiter(this, void 0, void 0, function* () {
        let completionList = yield TestCompletionUtil_1.complete("ShouldShowExtensions.cs", 3, 2);
        testUtil_1.assertContains(completionList, "Select");
    }));
    test("Should show extension methods for primitive types", () => __awaiter(this, void 0, void 0, function* () {
        let completionList = yield TestCompletionUtil_1.complete("ShouldShowPrimitiveExtensions.cs", 2, 2);
        testUtil_1.assertContains(completionList, "AsSpan");
    }));
    test("Should show extension methods of base classes of the type", () => __awaiter(this, void 0, void 0, function* () {
        let completionList = yield TestCompletionUtil_1.complete("ShouldShowBaseExtensions.cs", 3, 2);
        testUtil_1.assertContains(completionList, "OfType");
    }));
    test("Should show extension methods for generic types", () => __awaiter(this, void 0, void 0, function* () {
        let completionList = yield TestCompletionUtil_1.complete("ShouldShowGenericExtensions.cs", 3, 2);
        testUtil_1.assertContains(completionList, "Select");
    }));
    test("Should show extension methods for fully qualified paths", () => __awaiter(this, void 0, void 0, function* () {
        let completionList = yield TestCompletionUtil_1.complete("ShouldExtendFullPaths.cs", 7, 14);
        testUtil_1.assertContains(completionList, "Select");
    }));
    test("Should not show extension methods for static types", () => __awaiter(this, void 0, void 0, function* () {
        let [completionList, doc] = yield TestCompletionUtil_1.completeWithData("ShouldNotShowExtensionsForStatic.cs", 6, 17);
        testUtil_1.assertNone(completionList.items, (completion) => completion.kind === vscode.CompletionItemKind.Reference);
    }));
    test("Should show extension methods after methods calls with parameters", () => __awaiter(this, void 0, void 0, function* () {
        let completionList = yield TestCompletionUtil_1.complete("ShouldShowExtensionsAfterParams.cs", 9, 43);
        testUtil_1.assertContains(completionList, "ToImmutableArray");
    }));
    test("Should show extension methods after parentheses", () => __awaiter(this, void 0, void 0, function* () {
        let completionList = yield TestCompletionUtil_1.complete("ShouldShowExtendAfterParentheses.cs", 7, 20);
        testUtil_1.assertContains(completionList, "Select");
    }));
    test("Should show extension methods even when there are spaces between the dot and other text", () => __awaiter(this, void 0, void 0, function* () {
        let completionList = yield TestCompletionUtil_1.complete("ShouldShowExtensionsForSpaces.cs", 7, 16);
        testUtil_1.assertContains(completionList, "Select");
    }));
    test("Should show extension methods for arrays", () => __awaiter(this, void 0, void 0, function* () {
        let completionList = yield TestCompletionUtil_1.complete("ShouldShowExtensionsForArray.cs", 6, 14);
        testUtil_1.assertContains(completionList, "Select");
    }));
});
//# sourceMappingURL=extensionMethods.test.js.map