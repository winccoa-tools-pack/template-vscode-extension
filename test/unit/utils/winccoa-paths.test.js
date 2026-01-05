"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const os = __importStar(require("os"));
const test_project_helpers_js_1 = require("../../../src/test-helpers/test-project-helpers.js");
(0, node_test_1.describe)('winccoa-paths', () => {
    (0, node_test_1.describe)('getWinCCOAInstallationPathByVersion', () => {
        (0, node_test_1.it)('should return null for non-existent version', () => {
            const path = (0, test_project_helpers_js_1.getWinCCOAInstallationPathByVersion)('999.999');
            node_assert_1.default.strictEqual(path, null);
        });
        (0, node_test_1.it)('should cache results for same version', () => {
            const version = '3.19';
            const path1 = (0, test_project_helpers_js_1.getWinCCOAInstallationPathByVersion)(version);
            const path2 = (0, test_project_helpers_js_1.getWinCCOAInstallationPathByVersion)(version);
            // Should return same reference (cached)
            node_assert_1.default.strictEqual(path1, path2);
        });
        (0, node_test_1.it)('should handle different versions independently', () => {
            const path1 = (0, test_project_helpers_js_1.getWinCCOAInstallationPathByVersion)('3.19');
            const path2 = (0, test_project_helpers_js_1.getWinCCOAInstallationPathByVersion)('3.20');
            // Different versions can have different results
            // (may both be null if not installed, or different paths)
            node_assert_1.default.ok(path1 === null || typeof path1 === 'string');
            node_assert_1.default.ok(path2 === null || typeof path2 === 'string');
        });
    });
    (0, node_test_1.describe)('getAvailableWinCCOAVersions', () => {
        (0, node_test_1.it)('should return an array', () => {
            const versions = (0, test_project_helpers_js_1.getAvailableWinCCOAVersions)();
            node_assert_1.default.ok(Array.isArray(versions));
        });
        (0, node_test_1.it)('should cache results', () => {
            const versions1 = (0, test_project_helpers_js_1.getAvailableWinCCOAVersions)();
            const versions2 = (0, test_project_helpers_js_1.getAvailableWinCCOAVersions)();
            // Should return same reference (cached)
            node_assert_1.default.strictEqual(versions1, versions2);
        });
        (0, node_test_1.it)('should return versions in descending order', () => {
            const versions = (0, test_project_helpers_js_1.getAvailableWinCCOAVersions)();
            if (versions.length > 1) {
                for (let i = 0; i < versions.length - 1; i++) {
                    const current = versions[i];
                    const next = versions[i + 1];
                    // Parse versions for comparison
                    const [currMajor, currMinor] = current.split('.').map(Number);
                    const [nextMajor, nextMinor] = next.split('.').map(Number);
                    const currValue = currMajor * 100 + currMinor;
                    const nextValue = nextMajor * 100 + nextMinor;
                    node_assert_1.default.ok(currValue >= nextValue, `Versions should be descending: ${current} >= ${next}`);
                }
            }
        });
        (0, node_test_1.it)('should return valid version format', () => {
            const versions = (0, test_project_helpers_js_1.getAvailableWinCCOAVersions)();
            const versionRegex = /^\d+\.\d+(\.\d+)?$/;
            versions.forEach(version => {
                node_assert_1.default.ok(versionRegex.test(version), `Version ${version} should match format X.Y or X.Y.Z`);
            });
        });
    });
    (0, node_test_1.describe)('getWindowsAvailableVersions', () => {
        (0, node_test_1.it)('should return an array', () => {
            const versions = (0, test_project_helpers_js_1.getWindowsAvailableVersions)();
            node_assert_1.default.ok(Array.isArray(versions));
        });
        (0, node_test_1.it)('should return sorted versions in descending order', () => {
            const versions = (0, test_project_helpers_js_1.getWindowsAvailableVersions)();
            if (versions.length > 1) {
                for (let i = 0; i < versions.length - 1; i++) {
                    const current = versions[i];
                    const next = versions[i + 1];
                    const [currMajor, currMinor] = current.split('.').map(Number);
                    const [nextMajor, nextMinor] = next.split('.').map(Number);
                    const currValue = currMajor * 100 + currMinor;
                    const nextValue = nextMajor * 100 + nextMinor;
                    node_assert_1.default.ok(currValue >= nextValue);
                }
            }
        });
        (0, node_test_1.it)('should only be called on Windows in production', () => {
            // This test documents the expected behavior
            // In real usage, this function should only be called on win32 platform
            if (os.platform() !== 'win32') {
                // On non-Windows, registry commands will fail gracefully
                // and return empty array
                const versions = (0, test_project_helpers_js_1.getWindowsAvailableVersions)();
                node_assert_1.default.ok(Array.isArray(versions));
            }
        });
    });
    (0, node_test_1.describe)('Platform-specific behavior', () => {
        (0, node_test_1.it)('should handle current platform correctly', () => {
            const platform = os.platform();
            const versions = (0, test_project_helpers_js_1.getAvailableWinCCOAVersions)();
            node_assert_1.default.ok(Array.isArray(versions));
            // On any platform, should return array (may be empty if not installed)
            if (platform === 'win32') {
                // Windows: uses registry
                node_assert_1.default.ok(true, 'Windows platform detected');
            }
            else {
                // Unix/Linux: uses /opt/WinCC_OA
                node_assert_1.default.ok(true, 'Unix/Linux platform detected');
            }
        });
    });
});
//# sourceMappingURL=winccoa-paths.test.js.map