export declare function getRunningDescription(): string;
export declare function getFinishedDescription(url: string): string;
export declare function appendToPullDescription(url: string): Promise<void>;
export declare function prependToPullDescription(): Promise<void>;
export declare function resetPullDescription(): Promise<void>;
export declare function isPullRequest(): boolean;
export declare function getPullRequestNumber(): number;
export declare function getBranch(): string;
