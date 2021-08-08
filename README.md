**IMPORTANT**: You need to follow the steps below to get started:

- [ ] Update the `action.yaml` with the correct data (i.e. Name of project, inputs, outputs etc.)
- [ ] Update the `package.json` with the correct name, version, etc.
- [ ] Update the `README.md` with the correct information & documentation.
- [ ] Add Unit Tests and remove `--passWithNoTests` argument in the `"scripts"` section of the `package.json`.

# blueprint-action-typescript

[![CI](https://github.com/bluenovaio/alpha-launchpad-action/actions/workflows/ci.yaml/badge.svg)](https://github.com/bluenovaio/alpha-launchpad-action/actions/workflows/ci.yaml)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/standard/semistandard)

Template repository for TypeScript Github Actions.

## Usage
> Update the following to give a quick C&P example that developers can use.

```yaml
name: "CI"

on:
  pull_request:
    branches:
      - main

jobs:
  launchpad:
    name: LaunchPade
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v1
      - id: runAction
        name: Run Action Code
        uses: bluenovaio/action-launchpad@main 
        with:
          # A directory containing a Dockerfile
          directory: ./examples/nodejs-simple
          
          # Provided by BlueNova team
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          
          # Name of the service
          name: gha-example
          
          # API Key provided by the BlueNova team
          api_key: ${{ secrets.BLUENOVA_API_KEY }}
          
          # Default token for the repository
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

#### Attribution

The OSS policies in this repository are based on [this](https://github.com/auth0/open-source-template) repo by Auth0.
