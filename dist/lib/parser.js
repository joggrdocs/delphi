"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseListInputs = void 0;
function parseListInputs(buildArgs) {
    if (buildArgs) {
        return buildArgs.split(',');
    }
    else {
        return [];
    }
}
exports.parseListInputs = parseListInputs;
//# sourceMappingURL=parser.js.map