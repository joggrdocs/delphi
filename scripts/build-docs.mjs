#!/usr/bin/env node

import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import tempo from '@joggr/tempo';
import YAML from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILEPATH_README = path.resolve(__dirname, path.join('..', 'README.md'));
const FILEPATH_ACTION_CONFIG = path.resolve(__dirname, path.join('..', 'action.yaml'));

const COMMENT_START = '<!-- docs:start -->';
const COMMENT_END = '<!-- docs:end -->';

const run = () => {
  process.stdout.write('📚 Building docs...\n');
  try {
    const actionYaml = fs.readFileSync(FILEPATH_ACTION_CONFIG, 'utf8');
    const parsedActionYaml = YAML.parse(actionYaml);
    
    const inputs = [];
    const outputs = [];

    for (const [key, value] of Object.entries(parsedActionYaml.inputs)) {
      const def = key !== 'gcp_project_id' ? value.default : '-';
      inputs.push([key, value.required ? 'yes' : 'no', value.description ?? 'no description provided', def ?? '-']);
    }

    for (const [key, value] of Object.entries(parsedActionYaml.outputs)) {
      outputs.push([key, value.description ?? 'no description provided']);
    }

    const api = tempo.default()
      .h3('Inputs')
      .table([
        ['Field', 'Required', 'Description', 'Default'],
        ...inputs,
      ])
      .h3('Outputs')
      .table([
        ['Field', 'Description'],
        ...outputs,
      ])
      .toString();

    const readme = fs.readFileSync(FILEPATH_README, 'utf8');
    const splitReadme = readme.split(COMMENT_START);
    const splitReadmeEnd = splitReadme[1].split(COMMENT_END);
    const newReadme = `${splitReadme[0]}${COMMENT_START}\n${api}\n${COMMENT_END}${splitReadmeEnd[1]}`;

    // Write the new README
    fs.writeFileSync(FILEPATH_README, newReadme);

    process.stdout.write('✅ Completed Building Docs\n');
  } catch (error) {
    process.stderr.write(`❌ Error: ${error.message}\n`);
    process.exit(1);
  }
};
run();
