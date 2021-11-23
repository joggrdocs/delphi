export interface Deployment {
    url: string;
}
export interface Organization {
    projectId: string;
    slugId: string;
}
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
    private readonly branch;
    private readonly commit;
    private readonly pullRequestNumber;
    private isSetup;
    private readonly envVars?;
    constructor(props: LaunchPadConfig);
    setup(): Promise<void>;
    createDeployment(): Promise<Deployment>;
    private readOrganization;
    private assertSetup;
}
export {};
