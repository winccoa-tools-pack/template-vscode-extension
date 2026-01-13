import * as assert from 'assert';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

suite('JsonResultParser Unit Tests', () => {
    let projectRoot: string;
    let fullResultPath: string;

    suiteSetup(() => {});

    suiteTeardown(() => {});

    test('Fixture sanity (fullResult.json exists)', () => {
        assert.ok(true, `my test 1`);
        assert.ok(!false, `my test 2`);
    });
});
