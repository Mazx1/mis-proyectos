"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
exports.default = (uris, encoding) => {
    return Promise.resolve(uris).then(uris => {
        return Promise.all(uris.map(uri => new Promise((resolve, reject) => {
            fs_1.readFile(uri.fsPath, encoding, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data.toString());
                }
            });
        })));
    });
};
//# sourceMappingURL=uriFilesReader.js.map