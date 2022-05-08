export interface Deployment {
    url: string;
}
export declare enum EventKind {
    PullRequest = "pull-request"
}
export declare enum EventState {
    Opened = "opened",
    Edited = "edited",
    Merged = "merged",
    Closed = "closed"
}
export interface Organization {
    projectId: string;
    slugId: string;
}
export declare function validateAppName(appName: string): void;
interface LaunchPadConfig {
    apiKey: string;
    name: string;
    port: string;
    envVars?: string;
}
export default class LaunchPad {
    slugId?: string;
    projectId?: string;
    private readonly apiKey;
    private readonly name;
    private readonly port;
    private readonly repository;
    private readonly organization;
    private readonly branch;
    private readonly commit;
    private readonly eventName;
    private readonly eventType;
    private readonly actorUserEmail;
    private readonly actorUserName;
    private readonly pullRequestNumber;
    private isSetup;
    private readonly envVars?;
    constructor(props: LaunchPadConfig);
    setup(): Promise<void>;
    createDeployment(): Promise<Deployment>;
    registerEvents(): Promise<void>;
    isDeployable(): boolean;
    private createEvent;
    private getEventKind;
    private getEventState;
    private getUser;
    private getEventData;
    private readOrganization;
    private assertSetup;
}
export {};
