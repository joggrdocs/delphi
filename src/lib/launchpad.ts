import { PullRequestEvent } from '@octokit/webhooks-definitions/schema';
import * as github from '@actions/github';
import * as core from '@actions/core';
import axios from 'axios';

import { getBranch, getPullRequestNumber } from './github';

const API_URL = 'https://launchpad-api.bluenova-app.com';

// Types
// -----

export interface Deployment {
  url: string;
}

export enum EventKind {
  PullRequest = 'pull-request',
}

export enum EventState {
  Opened = 'opened',
  Edited = 'edited',
  Merged = 'merged',
  Closed = 'closed'
}

export interface Organization {
  projectId: string;
  slugId: string;
}

// Utils
// -----

export function validateAppName (appName: string) {
  if (!/^([a-z]+)$/.test(appName)) {
    throw new Error(`The appName "${appName}" is invalid, as it must be all lower case, no number and no special characters`);
  }
}

// LaunchPad Class
// -----

interface LaunchPadConfig {
  apiKey: string;
  name: string;
  port: string;
  envVars?: string;
}

export default class LaunchPad {
  public slugId?: string;
  public projectId?: string;
  private readonly apiKey: string;
  private readonly name: string;
  private readonly port: string;
  private readonly repository: string;
  private readonly branch: string;
  private readonly commit: string;
  private readonly userEmail: string;
  private readonly userName: string;
  private readonly pullRequestNumber: number;
  private isSetup = false;
  private readonly envVars?: string;

  constructor (props: LaunchPadConfig) {
    this.apiKey = props.apiKey;
    this.name = props.name;
    this.port = props.port;
    this.envVars = props.envVars;
    this.commit = github.context.sha;
    this.pullRequestNumber = getPullRequestNumber();
    this.repository = github.context.repo.repo;
    this.branch = getBranch();
    this.userEmail = github.context.payload.sender?.email;
    this.userName = github.context.payload.sender?.login;
  }

  public async setup (): Promise<void> {
    const organization = await this.readOrganization();

    this.projectId = organization.projectId;
    this.slugId = organization.slugId;

    this.isSetup = true;
  }

  public async createDeployment (): Promise<Deployment> {
    this.assertSetup();

    const result = await axios.post(`${API_URL}/deployments`, {
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

  public async registerEvents () {
    core.info(JSON.stringify(github.context, null, 1));
    if (github.context.eventName === 'pull_request') {
      if (['opened', 'closed', 'edited'].includes(github.context.action)) {
        await this.createEvent();
      }
    }
  }

  private async createEvent (): Promise<void> {
    this.assertSetup();

    core.info('THIS HERE');
    core.info(JSON.stringify({
      apiKey: this.apiKey,
      kind: this.getEventKind(),
      state: this.getEventState(),
      user: this.getUser(),
      data: this.getEventData()
    }, null, 1));

    // await axios.post(`${API_URL}/events`, {
    //   apiKey: this.apiKey,
    //   kind: this.getEventKind(),
    //   state: this.getEventState(),
    //   user: this.getUser(),
    //   data: this.getEventData()
    // });
  }

  private getEventKind (): EventKind {
    switch (github.context.eventName) {
      case 'pull_request':
        return EventKind.PullRequest;
      default:
        throw new Error(`Event not supported: ${github.context.eventName}`);
    }
  }

  private getEventState (): EventState {
    const payload = github.context.payload as PullRequestEvent;
    switch (github.context.action) {
      case 'opened':
        return EventState.Opened;
      case 'edited':
        return EventState.Edited;
      case 'closed':
        return payload.pull_request.merged ? EventState.Merged : EventState.Closed;
      default:
        throw new Error(`Action not supported: ${github.context.action}`);
    }
  }

  private getUser (): Record<string, string | number> {
    return {
      email: this.userEmail,
      githubUserName: this.userName
    };
  }

  private getEventData (): Record<string, string | number> {
    return {
      name: this.name,
      branch: this.branch,
      repository: this.repository,
      commit: this.commit,
      pullRequestNumber: this.pullRequestNumber,
    };
  }

  private async readOrganization (): Promise<Organization> {
    const result = await axios.get(`${API_URL}/organizations/${this.apiKey}`);
    return result.data;
  }

  private assertSetup () {
    if (!this.isSetup) {
      throw new Error('You must call the "LaunchPad#setup" method before running any commands');
    }
  }
}
