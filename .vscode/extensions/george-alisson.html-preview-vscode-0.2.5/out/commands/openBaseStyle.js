"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
class OpenBaseStyleCommand {
    constructor(context) {
        this.context = context;
        this.id = 'html.openBaseStyle';
    }
    execute() {
        const resource = vscode.Uri.file(this.context.asAbsolutePath(path.join('media', 'basestyle.css')));
        return vscode.commands.executeCommand('vscode.open', resource);
    }
}
exports.OpenBaseStyleCommand = OpenBaseStyleCommand;
