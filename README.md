<div>
    <p align="center">
        <img src="/.github/assets/logo.png" align="center" width="280" />
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

          # The GCP Service Account Key, used to authenticate with GCP
          gcp_service_account_key: ${{ secrets.PREVIEWS_SERVICE_ACCOUNT_KEY }}
          
          # The GCP Project ID
          gcp_project_id: ${{ secrets.GCP_PROJECT_ID }}

          # (optional) The GCP Region, defaults to us-central1
          gcp_region: ${{ secrets.GCP_REGION }}

          # (optional) The GCP Artifact Registry, where the Docker image will be stored
          gcp_artifact_registry: ${{ secrets.GCP_ARTIFACT_REGISTRY }}
          
          # Default token for the repository
          github_token: ${{ secrets.GITHUB_TOKEN }}

          # (Optional) A directory containing a Dockerfile
          docker_directory: ./examples/nodejs-simple

          # (Optional) The Dockerfile name, you can override for custom names (i.e. DevDockerfile)
          docker_file_name: DevDockerfile

          # (Optional) Docker Build Arguments (i.e. --build-args) that will be injected during the build 
          docker_build_args: FOO=bar,BAR=foo

```

#### Attribution

The OSS policies in this repository are based on [this](https://github.com/auth0/open-source-template) repo by Auth0.
