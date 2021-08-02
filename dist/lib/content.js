"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFinishedDescription = exports.getRunningDescription = void 0;
function getRunningDescription() {
    return `
[//]: # (bn-start)
⚠️  **BlueNova deployment in progress** ⚠️ 

BlueNova deploying a Preview of this change, please wait until completed before pushing a new commit.

---
[//]: # (bn-end)
`.trim();
}
exports.getRunningDescription = getRunningDescription;
function getFinishedDescription(url) {
    return `
[//]: # (bn-start)
---
🚀 **BlueNova Deployment**

**Preview Url:** [${url}](${url})
[//]: # (bn-end)
  `.trim();
}
exports.getFinishedDescription = getFinishedDescription;
//# sourceMappingURL=content.js.map