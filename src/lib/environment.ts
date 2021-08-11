import * as _ from 'lodash';

export function parseEnvVars (envVars: Record<string, string>): string {
  const result: string[] = [];

  _.forOwn(envVars, (value, key) => {
    if (_.startsWith('LP_ENV_', key)) {
      result.push(`${key}=${value}`);
    }
  });

  return result.join(',');
}
