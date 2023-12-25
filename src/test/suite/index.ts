
import * as assert from 'assert';
import * as vscode from 'vscode';

suite(`Extension Test Suite`, () => {
    test(`Update test`, async () => {
        // Get a reference to your extension
        const extension = vscode.extensions.getExtension(`yangzhao.auto-updater`);
        assert.ok(extension);

        // Activate your extension if it's not already active
        if (!extension.isActive) {
            await extension.activate();
        }

        // Get a reference to your API
        const api = extension.exports;
        assert.ok(api);

        // Call your update function
        const result = await api.getUpdater();

        // Check the result
        assert.ok(result);

        // Add more assertions as needed to verify that the update was successful
    });

    // Add more tests as needed
});
