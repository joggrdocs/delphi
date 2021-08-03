import * as github from '../github';

const contentStart = `
[//]: # (bn-top-start)
⚠️  **BlueNova deployment in progress** ⚠️ 

BlueNova deploying a Preview of this change, please wait until completed before pushing a new commit.

---

[//]: # (bn-top-end)
`.trim();

const content = `
By submitting a PR to this repository, you agree to the terms within the [Code of Conduct](/CODE-OF-CONDUCT.md). Please see the [contributing guidelines](/CONTRIBUTING.md) for how to create and submit a high-quality PR for this repo.

### Description

> Describe the purpose of this PR along with any background information and the impacts of the proposed change. For the benefit of the community, please do not assume prior context.
>
> Provide details that support your chosen implementation, including: breaking changes, alternatives considered, changes to the API, etc.
>
> If the UI is being changed, please provide screenshots.
`.trim();

const contentEnd = `
[//]: # (bn-bottom-start)

---

🚀 **BlueNova Deployment**

**Preview Url:** [https://example-solution.com](https://example-solution.com)

[//]: # (bn-bottom-end)
`.trim();

describe('cleanDescription', () => {
  it('trimStart', () => {
    const input = contentStart + content;
    const output = github.cleanDescription(input);
    expect(output).toEqual(content);
  });

  it('trimEnd', () => {
    expect(
      github.cleanDescription(content + contentEnd)
    ).toEqual(content);
  });
});
