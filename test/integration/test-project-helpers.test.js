"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const assert_1 = require("assert");
const test_project_helpers_js_1 = require("../../src/test-project-helpers.js");
(0, node_test_1.describe)('Test Project Helpers Example', () => {
    // Example 1: Manual registration and cleanup
    (0, node_test_1.it)('should register and unregister test project manually', async () => {
        let project;
        try {
            project = await (0, test_project_helpers_js_1.registerRunnableTestProject)();
            assert_1.strict.ok(project, 'Project should be created');
            assert_1.strict.ok(project.getId(), 'Project should have an ID');
            assert_1.strict.ok(project.isRegistered(), 'Project should be registered');
        }
        finally {
            if (project) {
                await (0, test_project_helpers_js_1.unregisterTestProject)(project);
            }
        }
    });
    // Example 2: Using the helper wrapper (automatic cleanup)
    (0, node_test_1.it)('should use project with automatic cleanup', async () => {
        await (0, test_project_helpers_js_1.withRunnableTestProject)(async (project) => {
            assert_1.strict.ok(project.getId(), 'Project should have an ID');
            console.log(`Using test project with ID: ${project.getId()}`);
            assert_1.strict.ok(project.isRegistered(), 'Project should be registered');
            // Your test logic here
            // Project will be automatically unregistered after this block
        });
    });
});
//# sourceMappingURL=test-project-helpers.test.js.map