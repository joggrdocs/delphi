import * as github from '@actions/github';
import axios from 'axios';

import { getBranch, getPullRequestNumber } from './github';

const API_URL = 'https://alpha-launchpad.bluenova-app.com';

// Types
// -----

export interface Deployment {
  url: string;
}

export interface Organization {
  projectId: string;
  slugId: string;
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
