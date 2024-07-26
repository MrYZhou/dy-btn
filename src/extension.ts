
import * as vscode from 'vscode';
import * as tool from './tool';
import * as data from './btn.json';

let actionMap = new Map();
function initBtn() {
    // todo 从配置读取
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
export async function activate(context: vscode.ExtensionContext) {
    // 展示动态按钮
    initBtn();
    // 注册按钮事件
    context.subscriptions.push(vscode.commands.registerCommand('dy-btn.action', async (key) => {
        if (!key) {
            return tool.showMessage('请前往配置文件配置');
        }
        let button = actionMap.get(key);
        // 执行函数的逻辑
        const fn = `async function dy(data, tool){${button.action}}`;

        if (button?.data) {
            // 收集参数
            let data:any = {};
            for (let index = 0; index < button?.data.length; index++) {
                let item = button?.data[index];
                let input = await vscode.window.showInputBox({
                    prompt: item.label,
                    placeHolder: item.placeHolder
                });
                if (input) {
                    data[item.key] = input;
                }
            }
        }
        const func = new Function('data', 'tool', fn + '\ndy(data, tool);');
        func(data, tool);
    }));
}

export function deactivate() { }
