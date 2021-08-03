export declare function getRunningDescription(): string;
export declare function getFinishedDescription(url: string): string;
export declare function cleanDescription(description: string): string;
export declare function appendToPullDescription(description: string): Promise<void>;
export declare function prependToPullDescription(description: string): Promise<void>;
export declare function resetPullDescription(): Promise<void>;
export declare function isPullRequest(): boolean;
export declare function getPullRequestNumber(): number;
export declare function getBranch(): string;
