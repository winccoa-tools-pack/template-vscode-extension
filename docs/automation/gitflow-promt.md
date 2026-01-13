
I think we need to refactor the workflows a little bit. What do you think? The workflow shall be:

---

## 1) Prepare a release branch from `develop`

Push to `develop` should trigger a pipeline to:

- Calculate the next recommended version (not implemented yet)
- Create a new branch: `release/v<recommended version>`
- Update `package.json` version to `<recommended version>` **on the release branch**
- Update `CHANGELOG.md` **on the release branch**
- Create a PR: `release/v<recommended version>` → `main`

Note: you need to wait first for the workflows:

- `CI/CD Pipeline`
- `Integration Tests - WinCC OA`

## 2) Pre-release from `release/**` (build once, test manually)

Any push to `release/**` (especially `release/v*`) triggers the **pre-release** process *after* CI workflows succeeded.

- Validate that `package.json` version matches the branch name (e.g. `release/v1.2.3` must have `1.2.3`)
- Create a **unique pre-release tag** based on the stable version + commit SHA:
  - Tag format: `v<stable version>-<shortsha>` (example: `v1.2.3-a1b2c3d`)
- Build the VS Code extension once:
  - `vsce package`
- Publish a **GitHub pre-release** and attach the produced `.vsix`

Why this way?

- GitHub Actions **artifacts are per workflow run**.
- The pre-release should contain the exact `.vsix` that maintainers can download and test locally before doing the final release.

## 3) Final release after merge to `main`

When the PR `release/v<version>` → `main` is merged:

- `main` release workflow runs after CI workflows succeeded
- Publish the extension to the VS Code Marketplace
- If publishing succeeds, remove old pre-release packages/releases for this version line (cleanup)

Important note:

- If the goal is “publish the **same** `.vsix` that was tested in pre-release”, the release workflow should download that `.vsix` from the GitHub pre-release assets (or another durable store), not rebuild it.

Note: direct push into `main` shall not be possible. We need branch protection later (separate task).

## 4) Keep `develop` updated

Every push/merge into `main` should create an “upmerge” PR `main` → `develop`.

---

Note: it may happen that we produce release branches but never merge them into `main`. Repository maintainers are responsible for removing stale branches.