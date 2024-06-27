// test/commands.test.ts
import * as assert from 'assert';
import * as vscode from 'vscode';
import * as sinon from 'sinon';
import { COMMANDS } from '../../constants';

suite('Hello World : Commands Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Hello World Command', async () => {

        const showInformationMessageStub = sinon.stub(vscode.window, 'showInformationMessage');

        // Execute the command
        await vscode.commands.executeCommand(COMMANDS.HELLO_WORLD);

        assert.strictEqual(showInformationMessageStub.calledOnce, true);
        assert.strictEqual(showInformationMessageStub.calledWith('Hello World from debricked!'), true);

        // Restore the stubbed method
        showInformationMessageStub.restore();
    });
});
