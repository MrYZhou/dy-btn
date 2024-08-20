
import * as vscode from 'vscode';
import * as tool from './tool';

let actionMap = new Map();

type Btn = { name: string; icon: string; id: string; action: string; data: any[] };
function initBtn() {
    // 从配置读取
    let config = vscode.workspace.getConfiguration('dy-btn', vscode.ConfigurationTarget.Global as any);
    
    let myButton;
    config.list.forEach((item: Btn) => {
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
    context.subscriptions.push(vscode.commands.registerCommand('dy-btn.action', async (key: any) => {
        if (!key) return
        let button = actionMap.get(key);
        // 执行函数的逻辑
        const fn = `async function dy(data, tool){${button.action}}`;
        const func = new Function('data', 'tool', fn + '\ndy(data, tool);');

        let data: any = tool.getConfig();
        if (button?.data) {
            // 收集参数
            for (let index = 0; index < button?.data.length; index++) {
                let item = button?.data[index];
                let input = await vscode.window.showInputBox({
                    prompt: item.label,
                    placeholder: item.placeHolder
                });
                if (input) {
                    data[item.key] = input;
                }
            }
        }
        func(data, tool);
    }));
}
export function deactivate() { }
