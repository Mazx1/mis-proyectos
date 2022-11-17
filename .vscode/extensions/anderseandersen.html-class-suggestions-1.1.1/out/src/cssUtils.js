"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeClassName = exports.findClassName = exports.findMediaRules = exports.findRootRules = exports.getCSSClasses = exports.getCSSSelectors = exports.getCSSRules = exports.parseCssTexts = void 0;
const css_1 = require("css");
const arrayUtils_1 = require("./arrayUtils");
function parseCssTexts(cssTexts) {
    const initialValue = {
        styleSheets: [],
        unparsable: []
    };
    return Promise.resolve(cssTexts).then(cssTexts => cssTexts.reduce((acc, cssText) => {
        try {
            acc.styleSheets.push(css_1.parse(cssText));
        }
        catch (error) {
            acc.unparsable.push(cssText);
        }
        return acc;
    }, initialValue));
}
exports.parseCssTexts = parseCssTexts;
function getCSSRules(styleSheets) {
    return Promise.resolve(styleSheets).then(styleSheets => styleSheets.reduce((acc, styleSheet) => {
        return acc.concat(findRootRules(styleSheet), findMediaRules(styleSheet));
    }, []));
}
exports.getCSSRules = getCSSRules;
function getCSSSelectors(rules) {
    return Promise.resolve(rules).then(rules => {
        if (rules.length > 0) {
            return arrayUtils_1.flatten(rules.map(rule => rule.selectors)).filter(value => value && value.length > 0);
        }
        else {
            return [];
        }
    });
}
exports.getCSSSelectors = getCSSSelectors;
function getCSSClasses(selectors) {
    return Promise.resolve(selectors).then(selectors => selectors.reduce((acc, selector) => {
        const className = findClassName(selector);
        if (className && className.length > 0) {
            acc.push(sanitizeClassName(className));
        }
        return acc;
    }, []));
}
exports.getCSSClasses = getCSSClasses;
function findRootRules(cssAST) {
    return cssAST.stylesheet.rules.filter(node => node.type === 'rule');
}
exports.findRootRules = findRootRules;
function findMediaRules(cssAST) {
    let mediaNodes = (cssAST.stylesheet.rules.filter(node => {
        return node.type === 'media';
    }));
    if (mediaNodes.length > 0) {
        return arrayUtils_1.flatten(mediaNodes.map(node => node.rules));
    }
    else {
        return [];
    }
}
exports.findMediaRules = findMediaRules;
function findClassName(selector) {
    let classNameStartIndex = selector.lastIndexOf('.');
    if (classNameStartIndex >= 0) {
        let classText = selector.substr(classNameStartIndex + 1);
        // Search for one of ' ', '[', ':' or '>', that isn't escaped with a backslash
        let classNameEndIndex = classText.search(/[^\\][\s\[:>]/);
        if (classNameEndIndex >= 0) {
            return classText.substr(0, classNameEndIndex + 1);
        }
        else {
            return classText;
        }
    }
    else {
        return "";
    }
}
exports.findClassName = findClassName;
function sanitizeClassName(className) {
    return className.replace(/\\[!"#$%&'()*+,\-./:;<=>?@[\\\]^`{|}~]/g, (substr, ...args) => {
        if (args.length === 2) {
            return substr.slice(1);
        }
        else {
            return substr;
        }
    });
}
exports.sanitizeClassName = sanitizeClassName;
//# sourceMappingURL=cssUtils.js.map