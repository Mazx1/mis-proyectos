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
const CompletionInstance_1 = require("./CompletionInstance");
const extension_1 = require("./extension");
class CompletionProvider {
    constructor(extensionContext) {
        this.extensionContext = extensionContext;
    }
    provideCompletionItems(document, position, token, context) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield CompletionInstance_1.provideCompletionItems(document, position, token, context, this.extensionContext);
                return result;
            }
            catch (e) {
                console.log(e.stack);
                throw new Error(e);
            }
        });
    }
}
exports.CompletionProvider = CompletionProvider;
function getStoredCompletions(context) {
    let completions = context.globalState.get(extension_1.COMPLETION_STORAGE);
    if (typeof completions === "undefined")
        return [];
    return completions;
}
exports.getStoredCompletions = getStoredCompletions;
//# sourceMappingURL=CompletionProvider.js.map