# WinCC OA VS Code Extension Template

Template repository for building **VS Code extensions for WinCC OA**, with a GitFlow-style branching model and a CI → prerelease → release pipeline.

## Quick start

Create a new repository from this template, then:

```bash
npm install
npm run compile
npm run test:unit
```

Run locally in VS Code:

- Press **F5** to open an **Extension Development Host**.

## Customize the template

Update placeholders in `package.json`:

- `name`, `displayName`, `description`
- `publisher` (VS Code Marketplace publisher ID)
- `icon` (e.g. `resources/vscode-<your-repository>-icon.png`)
- `repository.url`, `bugs.url`, `homepage`
- `activationEvents` and `contributes.commands[].command`

Example:

```bash
npm pkg set name='vscode-my-extension'
npm pkg set displayName='WinCC OA — My Extension'
npm pkg set publisher='my-publisher'
```

## Development scripts

These scripts exist in this template:

- Build: `npm run compile`
- Watch: `npm run watch`
- Lint: `npm run lint` and `npm run lint:md`
- Format check: `npm run format:check`
- Unit tests: `npm run test:unit`
- Integration tests (WinCC OA container): `npm run ci:integration`

## Branching model (GitFlow)

- `develop` is the default branch (day-to-day work)
- `main` is the stable branch (releases)
- `feature/*` / `bugfix/*` target `develop`
- `release/vX.Y.Z` and `hotfix/vX.Y.Z` target `main`

Automation overview:

- PR validation: `.github/workflows/gitflow-validation.yml`
- Upmerge `main` → `develop` via PR: `.github/workflows/gitflow.yml`
- Create release/hotfix branches + PR: `.github/workflows/create-release-branch.yml`
  - Important: this workflow does **not** update `CHANGELOG.md`.

More details:

- `docs/automation/GITFLOW_WORKFLOW.md`

## CI + Integration tests

- CI pipeline: `.github/workflows/ci-cd.yml`
- WinCC OA integration tests: `.github/workflows/integration-winccoa.yml`

More details:

- `docs/automation/CI-INTEGRATION.md`

## Pre-release + release pipeline

This template uses a **tested-artifact flow**:

1. A prerelease workflow builds/tests and uploads a VSIX to a GitHub **pre-release**.
2. The stable release workflow requires that prerelease artifact and republishes that tested VSIX.

Workflows:

- `.github/workflows/pre-release.yml` (alpha prerelease on PRs to `main`)
- `.github/workflows/release.yml` + `.github/workflows/release-reusable.yml` (stable release from `main`)

Marketplace publishing:

- Optional secret: `VSCE_PAT` (if set, the release workflow publishes to the VS Code Marketplace).

## First-time setup checklist

- Update placeholders in `package.json` (name, publisher, repo URLs, command IDs).
- Decide on your default branch strategy (this template assumes `develop` is default).
- Configure secrets (as needed):
  - `VSCE_PAT` (optional) to publish to VS Code Marketplace during stable release.
  - `REPO_ADMIN_TOKEN` (recommended) to let `.github/workflows/apply-settings-and-rulesets.yml` apply `.github/repository.settings.yml` and `.github/rulesets/*`.
  - `DOCKER_USER` + `DOCKER_PASSWORD` (optional) only if your WinCC OA image is private on Docker Hub.
- Run Actions once to verify everything:
  - `CI/CD Pipeline`
  - `PR Labels` (open a PR to see labels apply)
  - `Git Flow Validation` (open a PR to see validation)
  - `Integration Tests - WinCC OA` (optional; requires a working image)

## Repo settings + rulesets automation

This template can apply repository settings + rulesets from YAML:

- Source of truth:
  - `.github/repository.settings.yml`
  - `.github/rulesets/*.yml`
- Workflow:
  - `.github/workflows/apply-settings-and-rulesets.yml`

To apply settings/rulesets, provide an admin-capable token:

- Secret: `REPO_ADMIN_TOKEN`
  - Classic PAT: scope `repo` (and authorize SSO if required)
  - Fine-grained PAT: repository access + **Administration: Read and write**

## License

MIT License. See https://github.com/winccoa-tools-pack/.github/blob/main/LICENSE.

## Disclaimer

WinCC OA and Siemens are trademarks of Siemens AG. This is a community project and is not affiliated with Siemens AG.
