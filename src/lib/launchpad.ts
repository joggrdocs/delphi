import * as github from '@actions/github';
import * as core from '@actions/core';
import axios from 'axios';

import { getBranch } from './github';

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
}

export default class LaunchPad {
  public slugId?: string;
  public projectId?: string;
  private readonly apiKey: string;
  private readonly name: string;
  private readonly repository: string;
  private readonly branch: string;
  private readonly commit: string;
  private isSetup = false;

  constructor (props: LaunchPadConfig) {
    this.apiKey = props.apiKey;
    this.name = props.name;
    this.commit = github.context.sha;
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

    core.info(`POST ${API_URL}/deployments`);
    const result = await axios.post(`${API_URL}/deployments`, {
      apiKey: this.apiKey,
      name: this.name,
      branch: this.branch,
      repository: this.repository,
      commit: this.commit
    });

    return result.data;
  }

  private async readOrganization (): Promise<Organization> {
    core.info(`GET ${API_URL}/organizations/${this.apiKey}`);
    const result = await axios.get(`${API_URL}/organizations/${this.apiKey}`);
    return result.data;
  }

  private assertSetup () {
    if (!this.isSetup) {
      throw new Error('You must call the "LaunchPad#setup" method before running any commands');
    }
  }
}
