import * as _ from 'lodash';

export function parseEnvVars (envVars: Record<string, string>): string {
  const result: string[] = [];

  _.forOwn(envVars, (value, key) => {
    if (_.startsWith(key, 'LP_ENV_')) {
      result.push(`${_.replace(key, 'LP_ENV_', '')}=${value}`);
    }
  });

  return result.join(',');
}
