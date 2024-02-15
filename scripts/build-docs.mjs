#!/usr/bin/env node

import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import tempo from '@joggr/tempo';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const run = () => {
  process.stdout.write('📚 Building docs...\n');

  const readmePath = path.resolve(__dirname, path.join('..', '..', 'README.md'));

  process.stdout.write('📚 Generating README.md...\n');
  process.stdout.write(readmePath);
};
