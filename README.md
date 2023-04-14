<!--@@joggrdoc@@-->
<!-- @joggr:version(v1):end -->
<!-- @joggr:warning:start -->
<!-- 
  _   _   _    __        __     _      ____    _   _   ___   _   _    ____     _   _   _ 
 | | | | | |   \ \      / /    / \    |  _ \  | \ | | |_ _| | \ | |  / ___|   | | | | | |
 | | | | | |    \ \ /\ / /    / _ \   | |_) | |  \| |  | |  |  \| | | |  _    | | | | | |
 |_| |_| |_|     \ V  V /    / ___ \  |  _ <  | |\  |  | |  | |\  | | |_| |   |_| |_| |_|
 (_) (_) (_)      \_/\_/    /_/   \_\ |_| \_\ |_| \_| |___| |_| \_|  \____|   (_) (_) (_)
                                                              
This document is managed by Joggr. Editing this document could break Joggr's core features, i.e. our 
ability to auto-maintain this document. Please use the Joggr editor to edit this document 
(link at bottom of the page).
-->
<!-- @joggr:warning:end -->
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

<!-- @joggr:editLink(0c299d04-2f79-4270-aa12-7e762a5eeb2d):start -->
---
<a href="https://app.joggr.io/app/documents/0c299d04-2f79-4270-aa12-7e762a5eeb2d/edit" alt="Edit on Joggr">
  <img src="https://img.shields.io/static/v1?label=&message=Edit%20doc%20on%20Joggr&style=for-the-badge&color=349ACA&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQOSURBVHgBtVdNTBNBFH67UBQK0vIPwUhBDngAjB4EE4GInssd4lHwIgl6Bs7EBC7CEQNn4Y5G8SAXE4EDHlCpP+GnAi0pYKQWfN90p0zbbbst+CVNd2ffzvfmve+9mdXIItbW1hwFBQVuTdPa+Nd8cnJSw8MO47Gfxzw8tsi/+UAgMOtyufxW5tVSGWxsbNTYbLZ+JnigEFrB5NHR0XBlZaWHMnEAK2YMHh8f99PZMKrr+rDT6fRbdgCrzsnJecOXNXQ+8HA0OsyiEeeA1+ttzsrKmkmH/Iv/Dw0vbNHWYZDuXSmgvqYSstv0OCdCoVBXWVnZojoYZYWVp0sOSHJg7luAXq7umZmJucFh6gBynknY94PHEXIJb8y96gQ4fD6fI84BCI4yyHk+h7qxNDdqLPY+1gkW9qC8ERowRLdGFjDzeY/erx8Ikp4GpxjbOvxLszy+eRCk1iq70IFqj+ewVXXBonRBlNm44TofskK+wMQTS9vievnXb/rK4ntys4zK87LpYWNxnP30Jx9NreyK64rcbHLXF0aeobfwX7+GfHBIfKnIsYq+Vz/ogHOuAuQjd6qo3G6LGsfKpbPA87vVVOe4oJr4uT+4dC4NN1kgfzq/HiG/zyEuz7OdPnu3LkpRQo0U0MfRiSEHHMFg0I2ktFMSgBTkUunI8QCHfaStKsqJR69/Ch3geuSDN/J+N+feXW/ewbks27Td3d2PvIE0J3JgYnmHZlbDXRThHu+8HBETSvAZk0GUEngmI9V1tZB6uSklwaJu7GqmwMQqOXKtKhklONhSEakGQJI3cZWkIAdqUAUJd7h8g8xuEEmhTbG6QdRVd0mMdV8rErbjHC3p7MCNUrIAh7azs3OSzAI5xeRy5WppxVYAbFGe0InJXmAKOIAStLTPq+QScA69oIVJM4Bfx0nGiiVKSyWvLQyXFYQ4tLAp0pIBPDo3oaVUVmalNd5ZzSo/Ddw0Oyc1kAYWkai3lIJcbUIorR4WHdDbVBxVAbNcMVMr1iOB86POzWCWrxMeIBF22YTQzWJLCxUgGxKgpTxlngLcOs5q7MmLREaIAADFD94qN7XZD4YiNoiQRUyCW/jLGxL26KjtGL197vs+tVbmCScaSy7GbThIC8quliMz5wnwNpwfZ5MI2IjYgfB2jIvt7e0xrojH0gAtGJMfHIVE7zcD1A+b7oYi1oWTrIIjPgZO4Ygc5HwM8Z9H3t/mlSPnrUnqGzZAhT2b0oDH4BKIkoyRivM8jseRc+g75OqBqH6JBzg6kxKJcybvUskB06L5D5GIW7mE6Y4BQ37hOsRCZwTmwFxm5EDKtoFocFqGjI9TqxC9hcU2mojYsgOKIw7j/NjOzjRROD2Rz3MK60Z8nqPDJfoYjcU/YCD1KmTczqkAAAAASUVORK5CYII=" />
</a>
<!-- @joggr:editLink(0c299d04-2f79-4270-aa12-7e762a5eeb2d):end -->