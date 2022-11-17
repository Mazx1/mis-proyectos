"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const opn = require("opn");
const file_1 = require("../util/file");
class ShowInBrowserCommand {
    constructor() {
        this.id = 'html.showInBrowser';
    }
    execute(mainUri) {
        if (mainUri && mainUri.fsPath) {
            return opn(mainUri.fsPath);
        }
        if (vscode.window.activeTextEditor && file_1.isHTMLFile(vscode.window.activeTextEditor.document)) {
            return opn(vscode.window.activeTextEditor.document.fileName);
        }
    }
}
exports.ShowInBrowserCommand = ShowInBrowserCommand;
