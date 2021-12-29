import * as github from '@actions/github';
import * as exec from '@actions/exec';
import * as _ from 'lodash';

const URL_ARTIFACT_REGISTRY = 'us-docker.pkg.dev';

// Utils
// -----

async function isBuildXAvailable (): Promise<boolean> {
  return await exec
    .getExecOutput('docker', ['buildx'], {
      ignoreReturnCode: true,
      silent: true
    })
    .then((res) => {
      if (res.stderr.length > 0 && Number(res.exitCode) !== 0) {
        return false;
      }
      return Number(res.exitCode) === 0;
    });
}

// Docker Class
// -----

interface DockerProps {
  name: string;
  projectId: string;
  slug: string;
  apiKey: string;
  serviceAccountKey: string;
  directory?: string;
  buildArgs?: string[];
}

export default class Docker {
  private isSetup = false;
  private readonly serviceAccountKey: string;
  private readonly projectId: string;
  private readonly directory: string;
  private readonly name: string;
  private readonly slug: string;
  private readonly buildArgs: string[];

  constructor (props: DockerProps) {
    this.serviceAccountKey = props.serviceAccountKey;
    this.projectId = props.projectId;
    this.directory = props.directory || '.';
    this.buildArgs = props.buildArgs || [];
    this.slug = props.slug;
    this.name = props.name;
  }

  public async setup (): Promise<void> {
    if (await isBuildXAvailable()) {
      await this.login();
      this.isSetup = true;
    } else {
      throw new Error('docker buildx is not available, unable to run this command');
    }
  }

  public async login (): Promise<void> {
    await exec.getExecOutput('docker', [
      'login',
      '-u _json_key',
      `https://${URL_ARTIFACT_REGISTRY}`,
      '--password-stdin'
    ], {
      input: Buffer.from(this.serviceAccountKey)
    });
  }

  public async buildAndPush (): Promise<void> {
    this.assertSetup();

    const buildCommand = [
      'build',
      '-t',
      this.getTag()
    ];

    if (this.buildArgs.length > 0) {
      _.forEach(this.buildArgs, (value) => {
        buildCommand.push(`--build-args ${value}`);
      });
    }

    buildCommand.push(
      this.directory
    );

    await exec.getExecOutput('docker', buildCommand);

    await exec.getExecOutput('docker', [
      'push',
      this.getTag()
    ]);
  }

  private getTag () {
    return `${URL_ARTIFACT_REGISTRY}/${this.projectId}/${this.slug}/${this.name}:${github.context.sha}`;
  }

  private assertSetup () {
    if (!this.isSetup) {
      throw new Error('You must call the "Docker#setup" method before running any commands');
    }
  }
}
