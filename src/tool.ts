import { exec as execFn } from 'child_process';
import * as path from 'path';
import * as vscode from 'vscode';

/**
 * 在vscode中打开命令执行
 * @param command 命令
 * @param sourceDir 执行位置
 */
const run = (command: string, sourceDir: string = '') => {
    if (!sourceDir) {
        sourceDir = getConfig().workspaceDir;
    }
    // 创建一个终端实例
    const terminal = vscode.window.createTerminal({
        name: 'Command Terminal',
        cwd: sourceDir
    });
    // 显示终端
    terminal.show();
    // 发送命令到终端
    terminal.sendText(command);
};
/**
 * 后台执行命令
 * @param command 命令
 * @param sourceDir 执行位置
 * @returns 
 */
const exec = (command: string, sourceDir: string = './'): Promise<boolean | string> => {
    return new Promise((resolve, reject) => {
        const options = {
            cwd: sourceDir,
            timeout: 100000, // 100 seconds
            maxBuffer: 2000 * 1024 * 1024, // 2 GB, which is still quite large but more reasonable
        };

        let result = '';
        const execInfo = execFn(command, options);

        execInfo?.stdout?.on('data', (data: Buffer | string) => {
            result += data.toString();
            process.stdout.write(data.toString());
        });

        execInfo?.stderr?.on('data', (data: Buffer | string) => {
            console.error('Error:', data.toString());
        });

        execInfo.on('close', (code: number) => {
            if (code === 0) {
                resolve(result);
            } else {
                resolve(false);
            }
        });

        execInfo.on('error', (error: Error) => {
            reject(error);
        });
    });
};

const msg = (message: string) => {
    vscode.window.showInformationMessage(message);
};

type Config = {
    /**
     * 当前打开文件的文件夹
     */
    currentDir: string;
    /**
     * 当前的工作目录
     */
    workspaceDir: string;
    /**
     * 当前打开文件的路径
     */
    focusFilePath: string;
};
const getConfig = () => {
   
    let workspaceDir = vscode.workspace.workspaceFolders?.[0].uri.fsPath as string;
    let config: Config = {
        workspaceDir,
        currentDir:'',
        focusFilePath:''
    };
    try {
        const editor = vscode.window.activeTextEditor as vscode.TextEditor;
        const filePath = editor.document.uri.fsPath;
        config.currentDir = path.dirname(filePath);
        config.focusFilePath = filePath;
    } catch (error) {
       
    }
    return config;
};

let funcsName = ['exec', 'msg', 'getConfig', 'run'];
let funcs = [exec, msg, getConfig, run];

export { funcsName, funcs, exec, msg, getConfig, run };