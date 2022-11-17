"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distinctByXXHash = exports.distinct = exports.flatten = void 0;
let XXH = require('xxhashjs').h32;
function flatten(nestedArray) {
    if (nestedArray.length === 0) {
        throw new RangeError("Can't flatten an empty array.");
    }
    else {
        return nestedArray.reduce((a, b) => a.concat(b));
    }
}
exports.flatten = flatten;
function distinct(items) {
    return Promise.resolve(items).then(items => Array.from(new Set(items)));
}
exports.distinct = distinct;
function distinctByXXHash(items) {
    const initialValue = {
        distinctItems: [],
        hashSet: new Set()
    };
    const accumulatorPromise = Promise.resolve(items).then(items => items.reduce((acc, item) => {
        const hash = XXH(item, 0x1337).toNumber();
        if (!acc.hashSet.has(hash)) {
            acc.distinctItems.push(item);
            acc.hashSet.add(hash);
        }
        return acc;
    }, initialValue));
    return accumulatorPromise.then(accumulator => accumulator.distinctItems);
}
exports.distinctByXXHash = distinctByXXHash;
//# sourceMappingURL=arrayUtils.js.map