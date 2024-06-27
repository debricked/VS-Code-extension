// test/commands.test.ts
import * as assert from 'assert';
import * as vscode from 'vscode';
import { resgisterCommands } from '../commands';
import { COMMANDS } from '../constants';
suite('Extension : Commands Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Register Commands', () => {
		const context: vscode.ExtensionContext = {
			subscriptions: [],
		} as any;

		resgisterCommands(context);

		for (const key in COMMANDS) {
			if (Object.prototype.hasOwnProperty.call(COMMANDS, key)) {
				assert.ok(vscode.commands.getCommands(true).then((list) => list.includes(COMMANDS[key])));
			}
		}

	});

});
