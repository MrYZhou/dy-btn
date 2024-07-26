
import * as vscode from 'vscode';
import * as tool from './tool';
let btnInfo = {
    action: "tool.showMessage('Hello World!');",
    action2:"await tool.execFn('node 全路径地址')",
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
        async function dy(data, tool){
            ${btnInfo.action}
        }
        `;
        const func = new Function('data', 'tool', fn + '\ndy(data, tool);');
        func(btnInfo, tool);
	});

	context.subscriptions.push(disposable);
    vscode.commands.executeCommand('dy-btn.helloWorld');
}

export function deactivate() {}
