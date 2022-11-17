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
const colors = require("colors");
const fs_1 = require("fs");
function activateExtension() {
    return __awaiter(this, void 0, void 0, function* () {
        const ext = vscode.extensions.getExtension("Fudge.auto-using");
        if (!ext.isActive) {
            yield ext.activate();
        }
    });
}
exports.activateExtension = activateExtension;
function activateCSharpExtension() {
    return __awaiter(this, void 0, void 0, function* () {
        const csharpExtension = vscode.extensions.getExtension("ms-vscode.csharp");
        if (!csharpExtension.isActive) {
            yield csharpExtension.activate();
        }
        yield csharpExtension.exports.initializationFinished();
    });
}
exports.activateCSharpExtension = activateCSharpExtension;
function assertContains(arr, element) {
    if (!arr.includes(element)) {
        let str = "Assertion Error:\n Expected array to contain: "
            + colors.green(JSON.stringify(element)) + "\n But actually contains: " + colors.red(JSON.stringify(arr));
        throw new Error(str);
    }
}
exports.assertContains = assertContains;
function assertStringContains(str, substring) {
    if (!str.includes(substring)) {
        let error = "Assertion Error: \n Expected string to contain : " + colors.green(str) +
            "But is actually " + substring;
        throw new Error(error);
    }
}
exports.assertStringContains = assertStringContains;
function assertInFirst(amount, arr, element) {
    let subArray = arr.slice(0, amount);
    if (!subArray.includes(element)) {
        let error = `Assertion Error : \n Expected first one of the first ${amount} elements in array to be ${JSON.stringify(element).green}, \n
        But they are actually ${JSON.stringify(subArray).red} 
        `;
        throw new Error(error);
    }
}
exports.assertInFirst = assertInFirst;
function assertSize(arr, size) {
    if (arr.length !== size)
        throw new Error(`Assertion Error:\n Array size is ${arr.length}, expected: ${size}`);
}
exports.assertSize = assertSize;
function assertNotContains(arr, element) {
    for (let i = 0; i < arr.length; i++) {
        const el = arr[i];
        if (el === element) {
            throw new Error(`Assertion Error: \n Expected array to not contain '${element}' but it contains it in index ${i}`);
        }
    }
}
exports.assertNotContains = assertNotContains;
/**
 * Asserts that none of the elements in the array return true to the specified attribute
 */
function assertNone(arr, attribute) {
    for (let i = 0; i < arr.length; i++) {
        const el = arr[i];
        if (attribute(el)) {
            throw new Error(`Assertion Error: \n Expected none of the elements to return true to ${attribute.toString().green},
             but the element ${JSON.stringify(el).red} at index ${i.toString().red} does return true.`);
        }
    }
}
exports.assertNone = assertNone;
function sleep(milliseconds) {
    let e = new Date().getTime() + (milliseconds);
    while (new Date().getTime() <= e) { }
}
exports.sleep = sleep;
const assetDir = "/src/test/assets";
const playgroundDir = "/src/test/playground";
function getTestAssetPath(testName) {
    return goBackFolders(__dirname, 2) + assetDir + "/" + testName;
}
function getTestPlaygroundPath(testName) {
    return goBackFolders(__dirname, 2) + playgroundDir + "/" + testName;
}
function getTestPlaygroundDirUri() {
    return vscode.Uri.file(goBackFolders(__dirname, 2) + playgroundDir);
}
exports.getTestPlaygroundDirUri = getTestPlaygroundDirUri;
function getTestPlaygroundUri(testname) {
    return vscode.Uri.file(getTestPlaygroundPath(testname));
}
function openTest(testName) {
    return __awaiter(this, void 0, void 0, function* () {
        // Move test to playground
        yield fs_1.writeFileSync(getTestPlaygroundPath(testName), yield fs_1.readFileSync(getTestAssetPath(testName)));
        let doc = yield vscode.workspace.openTextDocument(getTestPlaygroundUri(testName));
        yield vscode.window.showTextDocument(doc);
        return doc;
    });
}
exports.openTest = openTest;
function goBackFolders(folder, times) {
    let newStringEnd;
    for (newStringEnd = folder.length - 1; newStringEnd--; newStringEnd >= 0) {
        let char = folder[newStringEnd];
        if (char === "/" || char === "\\")
            times--;
        if (times <= 0)
            break;
    }
    return folder.substr(0, newStringEnd);
}
//# sourceMappingURL=testUtil.js.map