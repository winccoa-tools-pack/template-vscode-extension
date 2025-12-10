# CI Integration with WinCC OA Docker image

This document describes how GitHub Actions runs integration tests against the WinCC OA Docker image `mpokornyetm/winccoa:v3.19.9-full`.

Required repository/organization secrets:

- `DOCKER_USER` — Docker registry username.
- `DOCKER_PASSWORD` — Docker registry password or token.

Workflow file: `.github/workflows/integration-winccoa.yml`

How it runs:

- The workflow pulls the WinCC OA image, starts a container named `winccoa-ci`, mounts the repository into `/workspace`, and executes `npm ci` and the `ci:integration` script inside the container.
- The script `.github/scripts/wait-for-winccoa.sh` can be used to wait for the runtime to be ready before running tests.

Running manually:

1. Ensure secrets `DOCKER_USER` and `DOCKER_PASSWORD` are added to the repository or organization.
2. From the Actions tab, find `Integration Tests - WinCC OA` and click `Run workflow`.

Notes:

- The workflow executes tests inside the container to avoid requiring WinCC OA on the host runner.
- If the image requires additional environment variables (license acceptance, ports, or credentials), add them as repository secrets and pass them to the `docker run` step in the workflow.
