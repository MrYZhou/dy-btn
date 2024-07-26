
import * as vscode from 'vscode';
import * as tool from './tool';
import * as data from './btn.json';


let actionMap = new Map();
function initBtn() {
    // 从配置读取
    let myButton;
    data.btnList.forEach(item => {
        myButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        myButton.tooltip = item.name;
        myButton.text = `${item.icon}`;
        myButton.color = 'white';
        myButton.command = {
            title: '',
            command: 'dy-btn.action',
            arguments: [item.id]
        };
        myButton.show();
        actionMap.set(item.id, item);
    });


}
function showAddDialog() {

}
export function activate(context: vscode.ExtensionContext) {
    // 展示动态按钮
    initBtn();

    // 注册按钮事件
    let disposable = vscode.commands.registerCommand('dy-btn.action', async (key) => {
        if (!key) {
            // 新增按钮页面
            return showAddDialog();
        }
        let button = actionMap.get(key);
        console.log(button, 123);
        // 执行函数的逻辑
        const fn = `
        async function dy(data, tool){
            ${button.action}
        }
        `;
        // 如果是对话框
        if(button?.dialog){
            
        }
        const func = new Function('data', 'tool', fn + '\ndy(data, tool);');
        let data = button?.dialog?.data;
        func(data, tool);
    });
    context.subscriptions.push(disposable);


    // 更新状态栏项的颜色
    updateStatusBarItemColor();
}

// 更新状态栏项的颜色
function updateStatusBarItemColor() {
    // console.log(vscode.window.activeColorTheme, 1243);
}


export function deactivate() { }
