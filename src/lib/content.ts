export function getRunningDescription (): string {
  return `
[//]: # (bn-start)
⚠️  **BlueNova deployment in progress** ⚠️ 

BlueNova deploying a Preview of this change, please wait until completed before pushing a new commit.

---
[//]: # (bn-end)
`.trim();
}

export function getFinishedDescription (url: string): string {
  return `
[//]: # (bn-start)
---
🚀 **BlueNova Deployment**

**Preview Url:** [${url}](${url})
[//]: # (bn-end)
  `.trim();
}
