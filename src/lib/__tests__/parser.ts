import * as parser from '../parser';

describe('parseBuildArgs', () => {
  it('returns build args if set', () => {
    expect(parser.parseListInputs('FOO=bar,BAR=foo'))
      .toEqual(['FOO=bar', 'BAR=foo']);
  });

  it('returns empty array if nil', () => {
    expect(parser.parseListInputs(''))
      .toEqual([]);
  });
});
