"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const csHierachies_1 = require("./csdata/csHierachies");
const csReferences_1 = require("./csdata/csReferences");
const csExtensionMethods_1 = require("./csdata/csExtensionMethods");
class DataProvider {
    constructor() {
        this.getHierachies = () => this.hierachies;
        this.getReferences = () => this.references;
        this.getExtensionMethods = () => this.extensionMethods;
        this.hierachies = this.cloneHiearchies(csHierachies_1._CSHARP_CLASS_HIEARCHIES);
        this.references = this.cloneReferences(csReferences_1._CSHARP_REFERENCES);
        this.extensionMethods = this.cloneExtensionMethods(csExtensionMethods_1._CSHARP_EXTENSION_METHODS);
    }
    cloneHiearchies(hierachiesToClone) {
        let len = hierachiesToClone.length;
        let hierachies = new Array(len);
        for (let i = 0; i < len; i++) {
            let hierachy = hierachiesToClone[i];
            let namespaceLen = hierachy.namespaces.length;
            let namespaces = new Array(namespaceLen);
            for (let j = 0; j < namespaceLen; j++) {
                let namespace = hierachy.namespaces[j];
                namespaces[j] = { namespace: namespace.namespace, fathers: namespace.fathers.slice(0) };
            }
            hierachies[i] = { class: hierachy.class, namespaces: namespaces };
        }
        return hierachies;
    }
    cloneReferences(referencesToClone) {
        let len = referencesToClone.length;
        let references = new Array(len);
        for (let i = 0; i < len; i++) {
            let reference = referencesToClone[i];
            references[i] = { name: reference.name, namespaces: reference.namespaces.slice(0) };
        }
        return references;
    }
    cloneExtensionMethods(extendedClassesToClone) {
        let len = extendedClassesToClone.length;
        let extensions = new Array(len);
        for (let i = 0; i < len; i++) {
            let extension = extendedClassesToClone[i];
            extensions[i] = { extendedClass: extension.extendedClass, extensionMethods: this.cloneReferences(extension.extensionMethods) };
        }
        return extensions;
    }
}
exports.DataProvider = DataProvider;
//# sourceMappingURL=DataProvider.js.map