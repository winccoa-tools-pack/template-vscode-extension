// src/extension.ts
import * as vscode from 'vscode';
import { ExtensionOutputChannel } from './extensionOutput';
import { EXTENSION_CONFIG_SECTION, EXTENSION_ID, EXTENSION_NAME } from './const';

const CORE_EXTENSION_ID = 'RichardJanisch.winccoa-project-admin';

let coreIntegrationSetupInFlight: Promise<void> | undefined;
let coreProjectChangeUnsubscribe: (() => void) | undefined;

export async function activate(context: vscode.ExtensionContext) {
    // Initialize output channel
    const outputChannel = ExtensionOutputChannel.initialize();
    context.subscriptions.push(outputChannel);

    ExtensionOutputChannel.info('Extension', `${EXTENSION_NAME} (${EXTENSION_ID}) activated`);
    ExtensionOutputChannel.info('Extension', `Extension Path: ${context.extensionPath}`);
    ExtensionOutputChannel.debug('Extension', `VS Code Version: ${vscode.version}`);

    // Setup Core extension integration if in automatic mode
    await setupCoreExtensionIntegration(context);

    // Watch for configuration changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration(`${EXTENSION_CONFIG_SECTION}.logLevel`)) {
                ExtensionOutputChannel.updateLogLevel();
            }
            if (e.affectsConfiguration(`${EXTENSION_CONFIG_SECTION}.pathSource`)) {
                // Re-setup Core integration when mode changes
                void setupCoreExtensionIntegration(context);
            }
        })
    );

    // Register a simple command
    const disposable = vscode.commands.registerCommand('winccoa.helloWorld', () => {
        vscode.window.showInformationMessage(`Hello from WinCC OA VS Code Extension!\n${EXTENSION_NAME}`);
    });

    context.subscriptions.push(disposable);
}


async function setupCoreExtensionIntegration(context: vscode.ExtensionContext) {
    if (coreIntegrationSetupInFlight) {
        return coreIntegrationSetupInFlight;
    }

    coreIntegrationSetupInFlight = (async () => {
    const config = vscode.workspace.getConfiguration(EXTENSION_CONFIG_SECTION);
    const pathSource = config.get<string>('pathSource', 'automatic');

    if (pathSource !== 'automatic') {
        ExtensionOutputChannel.info('CoreIntegration', 'Static mode - Core extension integration disabled');
        if (coreProjectChangeUnsubscribe) {
            coreProjectChangeUnsubscribe();
            coreProjectChangeUnsubscribe = undefined;
        }
        return;
    }

    const coreExtension = vscode.extensions.getExtension(CORE_EXTENSION_ID);
    
    if (!coreExtension) {
        ExtensionOutputChannel.warn('CoreIntegration', 'WinCC OA Core extension not found - automatic mode unavailable');
        return;
    }

    // Core extension is typically activated via its own activationEvents (e.g. onStartupFinished).
    // Explicitly calling activate() here can race and cause the Core to initialize twice.
    if (!coreExtension.isActive) {
        ExtensionOutputChannel.info('CoreIntegration', 'Waiting for Core extension to activate...');
        const becameActive = await waitForExtensionActive(coreExtension, 4000);
        if (!becameActive) {
            // Fallback: if it still isn't active, try activating once.
            ExtensionOutputChannel.info('CoreIntegration', 'Core still inactive - activating (fallback)...');
            await coreExtension.activate();
        }
    }

    ExtensionOutputChannel.info('CoreIntegration', 'Core extension active');

    const coreApi = coreExtension.exports;
    if (!coreApi) {
        ExtensionOutputChannel.warn('CoreIntegration', 'Core extension has no exported API');
        return;
    }

    // Avoid stacking multiple listeners if setup runs more than once
    if (coreProjectChangeUnsubscribe) {
        coreProjectChangeUnsubscribe();
        coreProjectChangeUnsubscribe = undefined;
    }
    
    // Subscribe to project changes
    const maybeUnsubscribe = coreApi.onDidChangeProject((project: any) => {
        if (project) {
            ExtensionOutputChannel.info('CoreIntegration', `Project changed: ${project.name} (${project.oaInstallPath})`);
        } else {
            ExtensionOutputChannel.info('CoreIntegration', 'No project selected');
        }
    });

    if (typeof maybeUnsubscribe === 'function') {
        coreProjectChangeUnsubscribe = maybeUnsubscribe;
        context.subscriptions.push({ dispose: maybeUnsubscribe });
    }

    const currentProject = coreApi.getCurrentProject();
    if (currentProject) {
        ExtensionOutputChannel.info('CoreIntegration', `Current project: ${currentProject.name} (${currentProject.oaInstallPath})`);
    } else {
        ExtensionOutputChannel.info('CoreIntegration', 'No project currently selected');
    }
    })().finally(() => {
        coreIntegrationSetupInFlight = undefined;
    });

    return coreIntegrationSetupInFlight;
}

async function waitForExtensionActive(extension: vscode.Extension<any>, timeoutMs: number): Promise<boolean> {
    if (extension.isActive) {
        return true;
    }

    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (extension.isActive) {
            return true;
        }
    }
    return extension.isActive;
}

export function deactivate() {
    ExtensionOutputChannel.info('Extension', `WinCC OA ${EXTENSION_NAME} Extension deactivated`);
    // Clean up if needed
    if (coreProjectChangeUnsubscribe) {
        coreProjectChangeUnsubscribe();
        coreProjectChangeUnsubscribe = undefined;
    }
}
 