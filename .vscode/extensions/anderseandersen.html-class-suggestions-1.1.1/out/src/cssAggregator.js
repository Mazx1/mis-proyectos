"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const flow = require("lodash.flow");
const uriFilesReader_1 = require("./uriFilesReader");
const arrayUtils_1 = require("./arrayUtils");
const cssUtils_1 = require("./cssUtils");
const styleSheetsReader = flow(uriFilesReader_1.default, arrayUtils_1.distinctByXXHash, cssUtils_1.parseCssTexts);
const distinctCSSClassesExtractor = flow(cssUtils_1.getCSSRules, cssUtils_1.getCSSSelectors, cssUtils_1.getCSSClasses, arrayUtils_1.distinct);
function default_1() {
    const startTime = process.hrtime();
    return styleSheetsReader(vscode_1.workspace.findFiles('**/*.css', ''), vscode_1.workspace.getConfiguration('files').get('encoding', 'utf8')).then(parseResult => {
        return distinctCSSClassesExtractor(parseResult.styleSheets).then(distinctCssClasses => {
            const elapsedTime = process.hrtime(startTime);
            console.log(`Elapsed time: ${elapsedTime[0]} s ${Math.trunc(elapsedTime[1] / 1e6)} ms`);
            console.log(`Files processed: ${parseResult.styleSheets.length}`);
            console.log(`Skipped due to parse errors: ${parseResult.unparsable.length}`);
            console.log(`CSS classes discovered: ${distinctCssClasses.length}`);
            vscode_1.window.setStatusBarMessage(`HTML Class Suggestions processed ${parseResult.styleSheets.length} distinct css files and discovered ${distinctCssClasses.length} css classes.`, 10000);
            return distinctCssClasses;
        });
    });
}
exports.default = default_1;
//# sourceMappingURL=cssAggregator.js.map