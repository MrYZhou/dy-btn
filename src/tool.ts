import { exec } from 'child_process';
import * as vscode from 'vscode';
/**
 * Executes a command in a child process and logs its output.
 * @param command The command to execute.
 * @param sourceDir The directory to execute the command in. Defaults to the current working directory.
 * @returns A promise that resolves to true if the command was successful, false otherwise.
 */
const execFn = (command: string, sourceDir: string = './'): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const options = {
      cwd: sourceDir,
      timeout: 100000, // 100 seconds
      maxBuffer: 2000 * 1024 * 1024, // 2 GB, which is still quite large but more reasonable
    };

    const execInfo = exec(command, options);

    execInfo?.stdout?.on('data', (data: Buffer | string) => {
      process.stdout.write(data.toString());
    });

    execInfo?.stderr?.on('data', (data: Buffer | string) => {
      console.error('Error:', data.toString());
    });

    execInfo.on('close', (code: number) => {
      if (code === 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    });

    execInfo.on('error', (error: Error) => {
      reject(error);
    });
  });
};

const showMessage = (message: string) => {
    vscode.window.showInformationMessage(message);
};
export { execFn ,showMessage};