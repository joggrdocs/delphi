<div>
    <p align="center">
        <img src="/.github/assets/logo.png" align="center" width="280" />
    </p>
    <hr>
    <blockquote align="center">
        "Know thyself" - Oracle of Delphi
    </blockquote>
</div>

<br>

<p align="center">
  <a href="https://github.com/joggrdocs/previews/actions/workflows/github-code-scanning/codeql">
    <img alt="CodeQL" src="https://github.com/joggrdocs/previews/actions/workflows/github-code-scanning/codeql/badge.svg">
  </a>
  <a href="https://github.com/joggrdocs/previews/actions/workflows/ci.yaml">
    <img alt="CI" src="https://github.com/joggrdocs/previews/actions/workflows/ci.yaml/badge.svg">
  </a>
  <br/>
</p>

Preview environments for every Pull Request.

## Usage

### Full Example

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
        name: '🚀 Launch Preview Environment'
        uses: joggrdocs/previews@v1
        with:
          # The name of your application (must be unique)
          name: my-application 

          # (optional) The port your application is running on, defaults to 8080
          port: 8080

          # (Optional) Environment Variables that will be injected during runtime
          env_vars: |
            FOO=bar
            BAR=foo

          # (Optional) Secrets that will be injected during runtime from GCP Secret Manager
          secrets: |
            MY_SECRET=my-secret:latest
            ANOTHER_SECRET=another-secret:latest

          # The GCP Service Account Key, used to authenticate with GCP
          gcp_service_account_key: ${{ secrets.PREVIEWS_SERVICE_ACCOUNT_KEY }}
          
          # The GCP Project ID
          gcp_project_id: ${{ secrets.GCP_PROJECT_ID }}

          # (optional) The GCP Region, defaults to us-central1
          gcp_region: ${{ secrets.GCP_REGION }}

          # (optional) The GCP Artifact Registry, where the Docker image will be stored
          gcp_artifact_repository: ${{ secrets.GCP_ARTIFACT_REPOSITORY }}
          
          # Default token for the repository
          github_token: ${{ secrets.GITHUB_TOKEN }}

          # (Optional) A directory containing a Dockerfile
          docker_directory: ./examples/nodejs-simple

          # (Optional) The Dockerfile name, you can override for custom names (i.e. DevDockerfile)
          docker_file_name: DevDockerfile

          # (Optional) Docker Build Arguments (i.e. --build-args) that will be injected during the build 
          docker_build_args: FOO=bar,BAR=foo
```

### Basic Example

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
        name: '🚀 Launch Preview Environment'
        uses: joggrdocs/previews@v1
        with:
          # The name of your application (must be unique)
          name: my-application 
          
          # The GCP Service Account Key, used to authenticate with GCP
          gcp_service_account_key: ${{ secrets.PREVIEWS_SERVICE_ACCOUNT_KEY }}
          
          # The GCP Project ID
          gcp_project_id: ${{ secrets.GCP_PROJECT_ID }}

          # Default token for the repository
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

## License

Licensed under MIT.

<br>
<hr>
<h2 align="center">
    Want to sign up for Joggr?
</h2>
<p align="center">
    We'd love to have you join, but we are in closed beta. <br> You can join our waitlist below.
</p>
<p align="center">
    <a href="https://www.joggr.io/closed-beta-waitlist?utm_source=github&utm_medium=org-readme&utm_campaign=static-docs" alt="Join the Waitlist">
        <img src="https://storage.googleapis.com/joggr-public-assets/github/badges/join-waitlist-badge.svg" width="250px" />
    </a>
</p>
