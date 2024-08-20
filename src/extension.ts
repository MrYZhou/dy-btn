
import * as vscode from 'vscode';
import { funcsName, funcs, getConfig } from "./tool";

let actionMap = new Map();

type Btn = { name: string; icon: string; id: string; action: string; data: any[] };
function initBtn() {
    // 从配置读取
    let list = initConfig()
    let myButton;
    list.forEach((item: Btn) => {
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
function initConfig() {
    let config = vscode.workspace.getConfiguration('dy-btn', vscode.ConfigurationTarget.Global as any);
    if (!config) {
        vscode.workspace.getConfiguration().update('dy-btn', {
            "list": []
        }, vscode.ConfigurationTarget.Global);
        config = vscode.workspace.getConfiguration('dy-btn', vscode.ConfigurationTarget.Global as any);
    }
    if (!config.list || config.list.length == 0) {
        let list = [{
            "id": 1,
            "name": "打开仓库",
            "icon": "$(github)",
            "action": "exec(`start ${await exec('git config --get remote.origin.url',data.workspaceDir)}`)"
        },
        {
            "id": 2,
            "icon": "$(run)",
            "action": "msg(data.path);",
            "data": [
                { "label": "执行脚本", "key": "path", "placeholder": "请输入脚本路径" }
            ]
        }]
        config.update('list', list, vscode.ConfigurationTarget.Global);
        return list
    }
    return config.list;

}

export async function activate(context: vscode.ExtensionContext) {
    // 展示动态按钮
    initBtn();
    // 注册按钮事件
    context.subscriptions.push(vscode.commands.registerCommand('dy-btn.action', async (key: any) => {
        if (!key) { return; };
        let button = actionMap.get(key);
        // 执行函数的逻辑
        let funcsStr = funcsName.join();
        const fn = `async function dy(data,${funcsStr}){${button.action}}`;
        const func = new Function('data', ...funcsName, fn + `\ndy(data, ${funcsStr});`);

        let data: any = getConfig();
        if (button?.data) {
            // 收集参数
            for (let index = 0; index < button?.data.length; index++) {
                let item = button?.data[index];
                let input = await vscode.window.showInputBox({
                    title: item.label,
                    prompt: item.label,
                    placeHolder: item.placeholder,
                    ignoreFocusOut: true,
                });

                if (input) {
                    data[item.key] = input;
                }
            }
        }
        func(data, ...funcs);
    }));
}
export function deactivate() { }
