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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAppName = exports.EventState = exports.EventKind = void 0;
const github = __importStar(require("@actions/github"));
const core = __importStar(require("@actions/core"));
const axios_1 = __importDefault(require("axios"));
const github_1 = require("./github");
const API_URL = (_a = process.env.URL_API_LAUNCHPAD) !== null && _a !== void 0 ? _a : 'https://launchpad-api.bluenova-app.com';
var EventKind;
(function (EventKind) {
    EventKind["PullRequest"] = "pull-request";
})(EventKind = exports.EventKind || (exports.EventKind = {}));
var EventState;
(function (EventState) {
    EventState["Opened"] = "opened";
    EventState["Edited"] = "edited";
    EventState["Merged"] = "merged";
    EventState["Closed"] = "closed";
})(EventState = exports.EventState || (exports.EventState = {}));
// Utils
// -----
function validateAppName(appName) {
    if (!/^([a-z]+)$/.test(appName)) {
        throw new Error(`The appName "${appName}" is invalid, as it must be all lower case, no number and no special characters`);
    }
}
exports.validateAppName = validateAppName;
class LaunchPad {
    constructor(props) {
        var _a, _b;
        this.isSetup = false;
        this.apiKey = props.apiKey;
        this.name = props.name;
        this.port = props.port;
        this.envVars = props.envVars;
        this.commit = github.context.sha;
        this.pullRequestNumber = (0, github_1.getPullRequestNumber)();
        this.repository = github.context.repo.repo;
        this.branch = (0, github_1.getBranch)();
        this.actorUserEmail = (_a = github.context.payload.sender) === null || _a === void 0 ? void 0 : _a.email;
        this.actorUserName = (_b = github.context.payload.sender) === null || _b === void 0 ? void 0 : _b.login;
    }
    async setup() {
        const organization = await this.readOrganization();
        this.projectId = organization.projectId;
        this.slugId = organization.slugId;
        this.isSetup = true;
    }
    async createDeployment() {
        this.assertSetup();
        const result = await axios_1.default.post(`${API_URL}/deployments`, {
            apiKey: this.apiKey,
            name: this.name,
            branch: this.branch,
            port: Number(this.port),
            repository: this.repository,
            commit: this.commit,
            pullRequestNumber: this.pullRequestNumber,
            environmentVariables: this.envVars
        });
        return result.data;
    }
    async registerEvents() {
        var _a;
        core.info('REGISTER EVENT');
        if (github.context.eventName === 'pull_request') {
            if (['opened', 'closed', 'synchronize', 'reopened'].includes((_a = github.context.payload.action) !== null && _a !== void 0 ? _a : '')) {
                core.info('CREATE EVENT');
                await this.createEvent();
            }
        }
    }
    async createEvent() {
        this.assertSetup();
        await axios_1.default.post(`${API_URL}/events`, {
            apiKey: this.apiKey,
            kind: this.getEventKind(),
            state: this.getEventState(),
            user: this.getUser(),
            data: this.getEventData()
        });
    }
    getEventKind() {
        switch (github.context.eventName) {
            case 'pull_request':
                return EventKind.PullRequest;
            default:
                throw new Error(`Event not supported: ${github.context.eventName}`);
        }
    }
    getEventState() {
        const payload = github.context.payload;
        switch (github.context.action) {
            case 'opened':
            case 'reopened':
                return EventState.Opened;
            case 'synchronize':
                return EventState.Edited;
            case 'closed':
                return payload.pull_request.merged ? EventState.Merged : EventState.Closed;
            default:
                throw new Error(`Action not supported: ${github.context.action}`);
        }
    }
    getUser() {
        return {
            email: this.actorUserEmail,
            githubUserName: this.actorUserName
        };
    }
    getEventData() {
        return {
            name: this.name,
            branch: this.branch,
            repository: this.repository,
            commit: this.commit,
            pullRequestNumber: this.pullRequestNumber,
        };
    }
    async readOrganization() {
        const result = await axios_1.default.get(`${API_URL}/organizations/${this.apiKey}`);
        return result.data;
    }
    assertSetup() {
        if (!this.isSetup) {
            throw new Error('You must call the "LaunchPad#setup" method before running any commands');
        }
    }
}
exports.default = LaunchPad;
//# sourceMappingURL=launchpad.js.map