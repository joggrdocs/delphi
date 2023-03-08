import { validateAppName } from '../launchpad';

describe('validateAppName', () => {
  it('does nothing with a valid name', () => {
    expect(() => {
      validateAppName('avalidname');
    }).not.toThrow();
  });

  it('throws for a name with _', () => {
    expect(() => {
      validateAppName('a_invalid_name');
    }).toThrow('The appName "a_invalid_name" is invalid, as it must be all lower case, no number and no special characters');
  });

  it('throws for a name with _', () => {
    expect(() => {
      validateAppName('a-invalid-name');
    }).toThrow('The appName "a-invalid-name" is invalid, as it must be all lower case, no number and no special characters');
  });

  it('throws for a name with 0-9', () => {
    expect(() => {
      validateAppName('ainvalidname1');
    }).toThrow('The appName "ainvalidname1" is invalid, as it must be all lower case, no number and no special characters');
  });

  it('throws for a name in caps', () => {
    expect(() => {
      validateAppName('aInvalidName');
    }).toThrow('The appName "aInvalidName" is invalid, as it must be all lower case, no number and no special characters');
  });
});

