
import * as vscode from 'vscode';
import * as tool from './tool';
let btnInfo = {
    action: "+function hello(){console.log(123)}",
    action1:"node 2.ts",
    data: { key: 'name' }
};

function initBtn(){

}

export function activate(context: vscode.ExtensionContext) {
    // 展示动态按钮
    initBtn();

    // 注册按钮事件
	let disposable = vscode.commands.registerCommand('dy-btn.helloWorld', async () => {
        await tool.execFn('echo 1');
       
       

        // 执行函数的逻辑
        const fn = `
        function dy(data, tool){
            tool.showMessage('Hello World!');
        }
        `;
        const func = new Function('data', 'tool', fn + '\ndy(data, tool);');
        func(btnInfo, tool);
	});

	context.subscriptions.push(disposable);
    vscode.commands.executeCommand('dy-btn.helloWorld');
}

export function deactivate() {}
