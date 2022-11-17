'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const TextConversor_1 = require("./TextConversor");
class HtmlConversor extends TextConversor_1.default {
    convert(input) {
        let newString;
        let cleanString = this.scapeAndSplitInput(input);
        return newString = cleanString
            .reduce((previousLine, currentLine, index, array) => {
            return this.processLines(currentLine, previousLine, index, array.length);
        }, "");
    }
    processLines(currentLine, previousLine, index, stringLength) {
        if (index === 0 && stringLength === 1) {
            return "'" + currentLine.trim() + "'";
        }
        if (index === 0 && stringLength > 1) {
            return "'" + currentLine.trim() + "'+\n";
        }
        if (index === stringLength - 1) {
            return previousLine + "'" + currentLine.trim() + "'";
        }
        else {
            return previousLine + "'" + currentLine.trim() + "'+\n";
        }
    }
}
exports.default = HtmlConversor;
//# sourceMappingURL=JavascriptConversor.js.map