"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFixturesPath = getFixturesPath;
exports.getTestProjectPath = getTestProjectPath;
exports.registerRunnableTestProject = registerRunnableTestProject;
exports.unregisterTestProject = unregisterTestProject;
exports.withRunnableTestProject = withRunnableTestProject;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const url_1 = require("url");
const ProjEnvProject_1 = require("../../src/types/project/ProjEnvProject");
const winccoa_paths_1 = require("../../src/utils/winccoa-paths");
const __filename = (0, url_1.fileURLToPath)(import.meta.url);
const __dirname = path_1.default.dirname(__filename);
/**
 * Gets the absolute path to the test fixtures directory
 */
function getFixturesPath() {
    return path_1.default.resolve(__dirname, '..', 'fixtures');
}
/**
 * Gets the absolute path to a test project fixture
 * @param projectName Name of the test project (e.g., 'runnable', 'sub-proj')
 */
function getTestProjectPath(projectName) {
    return path_1.default.join(getFixturesPath(), 'projects', projectName);
}
/**
 * Creates and registers a runnable WinCC OA test project
 * @returns ProjEnvProject instance for the registered test project
 * @throws Error if registration fails
 *
 * @example
 * ```typescript
 * const project = await registerRunnableTestProject();
 * try {
 *   // Use project in tests
 *   await project.start();
 * } finally {
 *   await project.unregisterProj();
 * }
 * ```
 */
async function registerRunnableTestProject() {
    const subProjectPath = getTestProjectPath('sub-proj');
    const subProject = new ProjEnvProject_1.ProjEnvProject();
    // Set project directory (this sets both install dir and project ID)
    subProject.setRunnable(false);
    subProject.setDir(subProjectPath);
    subProject.setName('test-sub-project');
    const availableVersions = (0, winccoa_paths_1.getAvailableWinCCOAVersions)();
    const testVersion = (availableVersions.length > 0) ? availableVersions[0] : '';
    subProject.setVersion(testVersion);
    await subProject.registerProj();
    const projectPath = getTestProjectPath('runnable');
    const project = new ProjEnvProject_1.ProjEnvProject();
    // Set project directory (this sets both install dir and project ID)
    project.setRunnable(true);
    project.setDir(projectPath);
    project.setName('test-runnable-project');
    project.setVersion(testVersion);
    // Update config file with actual WinCC OA path and version
    const configPath = path_1.default.join(projectPath, 'config', 'config');
    if (fs_1.default.existsSync(configPath)) {
        try {
            // Get the first available WinCC OA version for testing
            const testPath = (0, winccoa_paths_1.getWinCCOAInstallationPathByVersion)(testVersion);
            if (testPath) {
                // Read the config file
                let configContent = fs_1.default.readFileSync(configPath, 'utf-8');
                // Replace placeholders with actual values
                configContent = configContent.replace(/<WinCC_OA_PATH>/g, testPath);
                configContent = configContent.replace(/<WinCC_OA_VERSION>/g, testVersion);
                // Write back the updated config
                fs_1.default.writeFileSync(configPath, configContent, 'utf-8');
            }
        }
        catch (error) {
            console.warn('Warning: Could not update test project config file:', error);
        }
    }
    // Try to register the project with WinCC OA if pmon is available
    // If pmon is not initialized, we still return the project object for testing
    try {
        const result = await project.registerProj();
        if (result !== 0) {
            console.warn(`Warning: Could not register test project (pmon may not be available): error code ${result}`);
        }
    }
    catch (error) {
        console.warn(`Warning: Project registration failed (pmon may not be available):`, error);
    }
    return project;
}
/**
 * Unregisters and cleans up a test project
 * @param project The project to unregister
 * @returns Promise that resolves when cleanup is complete
 */
async function unregisterTestProject(project) {
    if (!project || !project.getId()) {
        return;
    }
    try {
        // Stop the project if it's running
        if (project.isRunning()) {
            await project.stop();
        }
        const subProject = new ProjEnvProject_1.ProjEnvProject();
        subProject.setId('sub-proj');
        subProject.setRunnable(false);
        subProject.setVersion(project.getVersion() || '');
        await subProject.unregisterProj();
        // Unregister the project
        await project.unregisterProj();
    }
    catch (error) {
        console.warn(`Warning: Failed to clean up test project ${project.getId()}:`, error);
    }
}
/**
 * Helper to run a test with a registered project that gets automatically cleaned up
 * @param testFn Test function that receives the registered project
 *
 * @example
 * ```typescript
 * it('should test project functionality', async () => {
 *   await withRunnableTestProject(async (project) => {
 *     await project.start();
 *     assert.ok(project.isRunning());
 *   });
 * });
 * ```
 */
async function withRunnableTestProject(testFn) {
    let project;
    try {
        project = await registerRunnableTestProject();
        await testFn(project);
    }
    finally {
        if (project) {
            await unregisterTestProject(project);
        }
    }
}
//# sourceMappingURL=test-project-helpers.js.map