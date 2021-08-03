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
Object.defineProperty(exports, "__esModule", { value: true });
const github = __importStar(require("@actions/github"));
const axios_1 = __importDefault(require("axios"));
const github_1 = require("./github");
const API_URL = 'https://alpha-launchpad.bluenova-app.com';
class LaunchPad {
    constructor(props) {
        this.isSetup = false;
        this.apiKey = props.apiKey;
        this.name = props.name;
        this.commit = github.context.sha;
        this.repository = github.context.repo.repo;
        this.branch = github_1.getBranch();
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
            repository: this.repository,
            commit: this.commit
        });
        return result.data;
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