
import * as vscode from 'vscode';
export function activate(context: vscode.ExtensionContext) {


	let disposable = vscode.commands.registerCommand('dy-btn.helloWorld', () => {
	
		vscode.window.showInformationMessage('Hello World from dy-btn!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
