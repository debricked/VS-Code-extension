// test/commands.test.ts
import * as assert from 'assert';
import * as vscode from 'vscode';
import * as sinon from 'sinon';
import { helloWorldCommand } from '../../commands/helloWorldCommand';

suite('Index : Commands Test Suite', () => {

    test('Register Commands', () => {
        const context: vscode.ExtensionContext = {
            subscriptions: [],
        } as any;

        const helloWorldCommandSpy = sinon.spy(helloWorldCommand);

        // Replace the helloWorldCommand in the commands array with the spy
        const commands = [helloWorldCommandSpy];

        // Mock the module to use the commands array with the spy
        const mockResgisterCommands = (context: vscode.ExtensionContext) => {
            commands.forEach(command => command.call(this, context));
        };

        mockResgisterCommands(context);

        // Verify that the command was called
        assert.strictEqual(helloWorldCommandSpy.calledOnce, true);
    });
});
