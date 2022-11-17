"use strict";
//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'assert' provides assertion methods from node
const testUtil_1 = require("./testUtil");
// import { testHelper, COMPLETION_STORAGE, Completion } from '../extension';
const assert = require("assert");
const extension_1 = require("../extension");
const extension = require("../extension");
const TestCompletionUtil_1 = require("./TestCompletionUtil");
const CompletionProvider_1 = require("../CompletionProvider");
// Defines a Mocha test suite to group tests of similar kind together
suite("CompletionProvider References Context Tests", function () {
    let context;
    let helper;
    suiteSetup(() => __awaiter(this, void 0, void 0, function* () {
        yield testUtil_1.activateExtension();
        //@ts-ignore
        context = extension_1.testHelper.context;
        helper = new TestCompletionUtil_1.DirectCompletionTestHelper(new CompletionProvider_1.CompletionProvider(context));
    }));
    test("Should add using expression", () => __awaiter(this, void 0, void 0, function* () {
        let [list, doc] = yield TestCompletionUtil_1.completeWithData("ShouldAddUsing.cs", 1, 5);
        yield extension_1.addUsing("System.Collections.Specialized", context, { name: "BitVector32", namespaces: ["System.Collections.Specialized"] }, 0);
        let addedLine = doc.lineAt(0).text;
        assert.equal(addedLine, "using System.Collections.Specialized;");
    }));
    test("Provides priority to completions that were chosen before", () => __awaiter(this, void 0, void 0, function* () {
        extension.wipeStoredCompletions(context);
        extension_1.storeCompletion(context, new extension_1.Completion("ApartmentState", "System.Threading"));
        let list = yield TestCompletionUtil_1.complete("ShouldPrioritize.cs", 1, 3);
        testUtil_1.assertInFirst(5, list, "ApartmentState");
    }));
    test("Should show completions", () => __awaiter(this, void 0, void 0, function* () {
        let completionList = yield helper.directlyComplete("ShouldShow.cs", 1, 5);
        testUtil_1.assertContains(completionList, "File");
    }));
});
//# sourceMappingURL=references.context.test.js.map