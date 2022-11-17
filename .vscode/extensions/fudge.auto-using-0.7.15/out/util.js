"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function flatten(arr) {
    return arr.reduce((acc, val) => acc.concat(val), []);
}
exports.flatten = flatten;
const debugging = false;
// Log only when debugging
function AUDebug(str) {
    if (debugging)
        console.log(str);
}
exports.AUDebug = AUDebug;
//# sourceMappingURL=util.js.map