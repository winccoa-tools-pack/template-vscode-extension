# WinCC OA VS Code Extension Template

A minimal starter template for building **VS Code extensions for WinCC OA** with automated publishing via GitHub Actions.

---

## 🚀 Quick Start

### 1) Create Your Extension Repo

```bash
# Using GitHub CLI
gh repo create winccoa-tools-pack/<your-repository> \
  --template winccoa-tools-pack/template-vscode-extension \
  --public
```

### 2) Clone, Install, Build

```bash
git clone https://github.com/winccoa-tools-pack/<your-repository>
cd <your-repository>

npm install
npm run compile
npm test
```

---

## 🧩 Rename Placeholders in `package.json`

Update these fields to match your extension:

- `name`: `@winccoa-tools-pack/vscode-<your-repository>`
- `displayName`: e.g., `WinCC OA — My Extension`
- `description`: Short summary of your extension
- `publisher`: Your Marketplace publisher ID
- `icon`: Path to your icon (e.g., `resources/vscode-<your-repository>-icon.png`)
- `repository.url`, `bugs.url`, `homepage`: Your repo links
- `contributes.commands[].command`: Replace `winccoa.<yourExtensionCommand>`
- `activationEvents`: Update to match your command ID

Example quick edits:

```bash
npm pkg set name='@winccoa-tools-pack/vscode-my-extension'
npm pkg set displayName='WinCC OA — My Extension'
npm pkg set publisher='winccoa-tools-pack'
```

---

## 📁 Recommended Project Structure

```text
<your-repository>/
├─ .github/                 # GitHub workflows (CI/CD)
├─ resources/               # Icons/images for VSIX
│  └─ vscode-<your-repository>-icon.png
├─ src/                     # TypeScript source
│  └─ extension.ts          # Extension entrypoint
├─ test/                    # Unit & integration tests
├─ out/                     # Webpack bundle output
├─ webpack.config.js        # Bundling config
├─ package.json             # Extension manifest
├─ tsconfig.json            # TS config
├─ .vscodeignore            # VSIX packaging ignore rules
├─ .gitignore               # Git ignore rules
└─ README.md
```

---

## 🔐 Marketplace Publishing

✅ **Fully automated**: When you create a **GitHub Release**, the CI pipeline builds your extension and publishes it to the VS Code Marketplace using the `VSCE_PAT` secret.

**What you need to do:**

- Set up your publisher account: <https://marketplace.visualstudio.com/manage>
- Add `VSCE_PAT` as a GitHub Actions secret
- Ensure `publisher` and `name` in `package.json` match your Marketplace publisher and extension name

No manual steps required—just tag a release and let the pipeline do the work!

---

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build (webpack -> out/extension.js)
npm run compile

# Watch & rebuild on change
npm run watch

# Run tests
npm test

# Package VSIX locally
npm run package

# Lint / format
npm run style-check
```

Run in VS Code:

- Press **F5** to open an **Extension Development Host**.

---

## ✅ Features

- **Webpack bundling** for optimized VSIX
- **TypeScript** with strict defaults
- **Lean VSIX** via `.vscodeignore`
- **CI/CD** for build, test, and publish on release

---

## 📜 License

MIT License. See <https://github.com/winccoa-tools-pack/.github/blob/main/LICENSE>.

---

## ⚠️ Disclaimer

**WinCC OA** and **Siemens** are trademarks of Siemens AG. This project is community-driven and not affiliated with Siemens AG.

---

## 🎉 Thank You

Thank you for using WinCC OA tools package!
We're excited to be part of your development journey. **Happy Coding! 🚀**

---

### Quick Links

- [📦 VS Code Marketplace](https://marketplace.visualstudio.com/search?term=tag%3Awincc-oa&target=VSCode&category=All%20categories&sortBy=Relevance)
- [SIMATIC WinCC Open Architecture](https://www.siemens.com/global/en/products/automation/industry-software/automation-software/scada/simatic-wincc-oa.html)
- [SIMATIC WinCC Open Architecture official documentation](https://www.winccoa.com/documentation/WinCCOA/latest/en_US/index.html)
- [ETM Company](https://www.winccoa.com/company.html)

<center>Made with ❤️ for and by the WinCC OA community</center>
