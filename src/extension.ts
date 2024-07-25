
import * as vscode from 'vscode';
let btnInfo = {
    action: "+function hello(){console.log(123)}",
    action1:"node 2.ts",
    data: { key: 'name' }
};
// let vscode ={}
let exec = (command:string)=>{
    console.log(command);   
};

// 执行函数的逻辑
// const functionString = `
// function dy(data, vscode){
//     vscode(111)
// }
// `;
// const func = new Function('data', 'vscode', functionString + '\ndy(data, vscode);');
// // 调用函数
// func(btnInfo, vscode);

function initBtn(){

}

export function activate(context: vscode.ExtensionContext) {
    // 展示动态按钮
    initBtn();

    // 注册按钮事件
	let disposable = vscode.commands.registerCommand('dy-btn.helloWorld', () => {
	
		vscode.window.showInformationMessage('Hello World from dy-btn!');
        // 执行函数的逻辑
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
