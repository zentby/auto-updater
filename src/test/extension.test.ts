import * as assert from "assert";
import * as vscode from "vscode";
import * as autoUpdater from "../extension";
import { AutoUpdater } from "../updater";

suite(`Extension Test Suite`, () => {
    vscode.window.showInformationMessage(`Start all tests.`);

    test(`Activate function should initialize autoUpdater`, async () => {
        const updater = await autoUpdater.activate();
        assert.ok(updater);
    });

    test(`autoUpdater should not be undefined after activate is called`, async () => {
        const updater = await autoUpdater.activate();
        assert.notStrictEqual(updater, undefined);
    });
});
