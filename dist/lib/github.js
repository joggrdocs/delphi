"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBranch = exports.getPullRequestNumber = exports.isPullRequest = exports.resetPullDescription = exports.prependToPullDescription = exports.appendToPullDescription = exports.cleanDescription = exports.addComment = exports.getFinishedDescription = exports.getRunningDescription = void 0;
const github = __importStar(require("@actions/github"));
const core = __importStar(require("@actions/core"));
const _ = __importStar(require("lodash"));
// eslint-disable-next-line no-unused-vars
const MARK_BN_TOP_START = '[//]: # (bn-top-start)';
const MARK_BN_TOP_END = '[//]: # (bn-top-end)';
const MARK_BN_BOTTOM_START = '[//]: # (bn-bottom-start)';
// eslint-disable-next-line no-unused-vars
const MARK_BN_BOTTOM_END = '[//]: # (bn-bottom-end)';
// Utils
// -----
function getRunningDescription() {
    return `
[//]: # (bn-top-start)
⚠️  **BlueNova deployment in progress** ⚠️ 

BlueNova deploying a Preview of this change, please wait until completed before pushing a new commit.

---

[//]: # (bn-top-end)
`.trim();
}
exports.getRunningDescription = getRunningDescription;
function getFinishedDescription(url) {
    return `
[//]: # (bn-top-start)

🚀 **BlueNova Deployment** | **Preview Url:** [${url}](${url})

---

[//]: # (bn-top-end)
  `.trim();
}
exports.getFinishedDescription = getFinishedDescription;
async function addComment(comment) {
    const prNumber = getPullRequestNumber();
    const octokit = github.getOctokit(core.getInput('github_token'));
    const { data: issue } = await octokit.rest.issues.createComment({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: prNumber,
        body: comment
    });
    if (!issue) {
        throw new Error(`No such pull request for PR: ${prNumber}`);
    }
}
exports.addComment = addComment;
async function updatePullRequest(updater) {
    const prNumber = getPullRequestNumber();
    const octokit = github.getOctokit(core.getInput('github_token'));
    const { data: pullRequest } = await octokit.rest.pulls.get({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: prNumber
    });
    if (!pullRequest) {
        throw new Error(`No such pull request for PR: ${prNumber}`);
    }
    await octokit.rest.pulls.update({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: pullRequest.number,
        body: updater(pullRequest.body)
    });
}
function cleanDescription(description) {
    const [, descriptionStart] = description.split(MARK_BN_TOP_END);
    const [descriptionEnd] = (descriptionStart || description).split(MARK_BN_BOTTOM_START);
    return descriptionEnd;
}
exports.cleanDescription = cleanDescription;
// Public Methods
// -----
async function appendToPullDescription(description) {
    await updatePullRequest((currentDescription) => {
        return `
${cleanDescription(currentDescription || '')}    
${description}
`;
    });
}
exports.appendToPullDescription = appendToPullDescription;
async function prependToPullDescription(description) {
    await updatePullRequest((currentDescription) => {
        return `
${description}
${cleanDescription(currentDescription || '')}    
`;
    });
}
exports.prependToPullDescription = prependToPullDescription;
async function resetPullDescription() {
    await updatePullRequest((currentDescription) => cleanDescription(currentDescription || ''));
}
exports.resetPullDescription = resetPullDescription;
function isPullRequest() {
    return true;
}
exports.isPullRequest = isPullRequest;
function getPullRequestNumber() {
    return Number(_.replace(_.replace(github.context.ref, 'refs/pull/', ''), '/merge', ''));
}
exports.getPullRequestNumber = getPullRequestNumber;
function getBranch() {
    return _.replace(github.context.ref, 'refs/heads/', '');
}
exports.getBranch = getBranch;
//# sourceMappingURL=github.js.map