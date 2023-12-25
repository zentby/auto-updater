import path from "path";
import { ExtensionContext, Uri } from "vscode";
import { FileDownloader } from "@microsoft/vscode-file-downloader-api";
import * as vscode from "vscode";
import { log } from "./logger";

export class AutoUpdater {
    public constructor(private _fileDownloader: FileDownloader) {}


    /**
     * Update extension automatically
     * @param extensionName Extension name
     * @param url Extension URI
     * @param context Extension context
     */
    public async update(url: string, context: ExtensionContext): Promise<void> {
        if (!isValidExtensionContext(context)) {
            throw new Error(`Invalid extension context`);
        }
        const extensionName = path.basename(context.extensionPath);
        log(`Updating extension ${extensionName} from ${url}}`);
        const filename = getFileName(extensionName);
        const file = await this._fileDownloader.downloadFile(Uri.parse(url), filename, context);
        await vscode.commands.executeCommand(`workbench.extensions.installExtension`, file);
        log(`Extension ${extensionName} updated`);
        await this._fileDownloader.deleteItem(filename, context);
    }
}
/**
 * Convert extension name to a valid file name
 * @returns {string} file name
 */
function getFileName(extensionName: string): string {
    return `${extensionName.replace(/[^A-Za-z0-9-]/g, `-`)}.vsix`;
}

/**
 * Validate extension context
 * @param context extension context
 * @returns {boolean} true if valid, false otherwise
 */
function isValidExtensionContext(context: any): context is vscode.ExtensionContext {
    return Boolean(context) &&
    typeof context === `object` &&
    `extensionPath` in context &&
    typeof context.extensionPath === `string` &&
    `globalState` in context &&
    typeof context.globalState === `object` &&
    `workspaceState` in context &&
    typeof context.workspaceState === `object` &&
    `subscriptions` in context &&
    Array.isArray(context.subscriptions) &&
    `globalStorageUri` in context &&
    context.globalStorageUri instanceof vscode.Uri &&
    `logUri` in context &&
    context.logUri instanceof vscode.Uri &&
    `storageUri` in context &&
    (context.storageUri === undefined || context.storageUri instanceof vscode.Uri) &&
    `extensionUri` in context &&
    context.extensionUri instanceof vscode.Uri &&
    `asAbsolutePath` in context &&
    typeof context.asAbsolutePath === `function`
    ;
}
