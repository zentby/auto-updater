import { OutputChannel, window } from "vscode";

let _outputChannel: OutputChannel | undefined;

export const log = (message: string) => {
    if (!_outputChannel) {
        _outputChannel = window.createOutputChannel(`Auto Updater`);
    }
    _outputChannel.appendLine(message);
};
