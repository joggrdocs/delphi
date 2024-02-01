import pino from 'pino';

/*
|==========================================================================
| Logger
|==========================================================================
|
| Our custom implementation of Pino that supports logging to Stackdriver (Google Cloud).
|
*/


/*
|--------------------------------------------------------------------------
| Stackdriver (GCP) Logging Support
|--------------------------------------------------------------------------
|
| Pino's output doesn't map directly to Stackdriver's logging format. This helps us
| get the data into the format that Stackdriver expects.
|
| @link https://getpino.io/#/docs/help?id=mapping-pino-log-levels-to-google-cloud-logging-stackdriver-severity-levels
|
*/

const enum PINO_LEVELS {
  trace = 10,
  debug = 20,
  info = 30,
  warn = 40,
  error = 50,
  fatal = 60,
}

function pinoLevelToStackdriverSeverity(level: PINO_LEVELS) {
  if (level === PINO_LEVELS.trace || level === PINO_LEVELS.debug) {
    return 'debug';
  }
  if (level === PINO_LEVELS.info) {
    return 'info';
  }
  if (level === PINO_LEVELS.warn) {
    return 'warning';
  }
  if (level === PINO_LEVELS.error) {
    return 'error';
  }
  if (level >= PINO_LEVELS.fatal) {
    return 'critical';
  }
  return 'default';
}

/*
|--------------------------------------------------------------------------
| Log Formatter
|--------------------------------------------------------------------------
|
| We are updating the format of the logs to match the expected format of logs with-in stackdriver (GCP).
|
| @link https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry
|
*/

const logger = pino({
  messageKey: 'message',
  timestamp: false,
  base: undefined,

  formatters: {
    level(_: any, number: number) {
      return {
        severity: pinoLevelToStackdriverSeverity(number),
      };
    }
  },
});

export default logger;
