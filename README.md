⚠️ **Beta Release** ⚠️ 

This is ONLY available for use by those in the closed Beta Program, if you are interested in joining please reachout to [support@joggr.io](mailto:support@joggr.io?subject=Previews).

---

<div>
    <p align="center">
        <img src="/logo.png" align="center" width="280" />
    </p>
    <hr>
</div>

Preview environments for every Pull Request.

## Usage

```yaml
name: "Preview Environments"

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
        uses: codereviewsai/previews@v0.1.0-beta3
        with:
          # Provided by the BlueNova team
          service_account_key: ${{ secrets.PREVIEWS_SERVICE_ACCOUNT_KEY }}
          
          # Name of the service
          name: ghaexample
          
          # API Key provided by the Previews team
          api_key: ${{ secrets.PREVIEWS_API_KEY }}
          
          # Default token for the repository
          github_token: ${{ secrets.GITHUB_TOKEN }}

          # (Optional) A directory containing a Dockerfile
          directory: ./examples/nodejs-simple

          # (Optional) The Dockerfile name, you can override for custom names (i.e. DevDockerfile)
          dockerfile: DevDockerfile

          # (Optional) Environment Variables that will be injected during runtime
          env_vars: FOO=bar,BAR=foo

          # (Optional) Docker Build Arguments (i.e. --build-args) that will be injected during the build 
          build_args: FOO=bar,BAR=foo

```

#### Attribution

The OSS policies in this repository are based on [this](https://github.com/auth0/open-source-template) repo by Auth0.
