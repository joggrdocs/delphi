⚠️ **Alpha Release** ⚠️ 

This is ONLY available for use by those in the closed Alpha Program, if you are interested in joining please reachout to [support@bluenova.io](mailto:support@bluenova.io?subject=Alpha%20Program).

---

# LaunchPad

[![CI](https://github.com/bluenovaio/action-launchpad/actions/workflows/ci.yaml/badge.svg)](https://github.com/bluenovaio/action-launchpad/actions/workflows/ci.yaml)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/standard/semistandard)

Launch your product(s) to the stars with LaunchPad.

## Usage
```yaml
name: "CI"

on:
  pull_request:
    branches:
      - main

jobs:
  launchpad:
    name: LaunchPad
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v1
      - id: runAction
        name: Run Action Code
        uses: bluenovaio/action-launchpad@v0.1.0-alpha
        env: 
          LP_ENV_MY_VAR: "Foobar" # You MUST prefix all environment variables with "LP_ENV_"
        with:
          # A directory containing a Dockerfile
          directory: ./examples/nodejs-simple
          
          # Provided by the BlueNova team
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
