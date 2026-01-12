import * as assert from 'assert';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

suite('JsonResultParser Unit Tests', () => {
    const fixturesDir = path.resolve(__dirname, '..', '..', '..', 'src', 'test', 'fixtures');
    const unitFixturePath = path.join(fixturesDir, 'unit-fullResult.json');

    let projectRoot: string;
    let fullResultPath: string;

    suiteSetup(() => {
        projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'winccoa-json-fixture-'));
        fullResultPath = path.join(projectRoot, 'fullResult.json');
        fs.copyFileSync(unitFixturePath, fullResultPath);
    });

    suiteTeardown(() => {
        if (projectRoot) {
            fs.rmSync(projectRoot, { recursive: true, force: true });
        }
    });

    test('Fixture sanity (fullResult.json exists)', () => {
        assert.ok(
            fs.existsSync(unitFixturePath),
            `Fixture missing: ${unitFixturePath} (fixturesDir=${fixturesDir})`,
        );
        assert.ok(
            fs.existsSync(fullResultPath),
            `Fixture copy missing: ${fullResultPath} (projectRoot=${projectRoot})`,
        );
    });
});
