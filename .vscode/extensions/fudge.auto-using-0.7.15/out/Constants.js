"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isWhitespace(char) {
    return /\s/.test(char) || char === "";
}
exports.isWhitespace = isWhitespace;
// Unicode's `Zero Width Space`. The benefit is that it has a higher unicode that any letter, so things that start with this will sort last.
exports.SORT_CHEAT = "\u200B";
exports.syntaxChars = ["{", "}", "(", ")", "[", "]", "<", ">", "@", ";", "=", "%", "&", "*", "+", ",", "-", "/", ":", "?", "^", "|"];
// Completions will show after these words because they usually a type comes after them unlike other words which are variable names
exports.showSuggestFor = ["abstract", "new", "protected", "return", "sizeof", "struct", "using", "volatile", "as",
    "checked", "explicit", "fixed", "goto", "lock", "override", "public", "stackalloc", "unchecked",
    "static", "base", "case", "else", "extern", "if", "params", "readonly", "sealed", "static", "typeof", "unsafe", "virtual", "const", "implicit",
    "internal", "private", "await", "this", "in"
];
exports.primitives = {
    bool: "Boolean", byte: "Byte", sbyte: "SByte", char: "Char", decimal: "Decimal",
    double: "Double", float: "Single", int: "Int32", uint: "UInt32", long: "Int64", ulong: "System.UInt64",
    object: "Object", short: "Int16", ushort: "Uint16", string: "String"
};
//# sourceMappingURL=Constants.js.map