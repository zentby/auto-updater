import path from 'path';
import fs from 'fs';
import { ExtensionContext, Uri } from 'vscode';
import { FileDownloader } from '@microsoft/vscode-file-downloader-api';
import * as vscode from 'vscode';
import streamZip from 'node-stream-zip';
import { log } from './logger';
import { IAutorUpdater } from './types';
import { Config } from './config';

export class AutoUpdater implements IAutorUpdater {
  public constructor(private _fileDownloader: FileDownloader) {}

  /**
   * Update extension automatically
   * @param extensionName Extension name
   * @param url Extension URI
   * @param context Extension context
   */
  public async update(url: string, context: ExtensionContext): Promise<void> {
    if (!isValidExtensionContext(context)) {
      throw new Error('Invalid extension context');
    }
    const extensionName = path.basename(context.extensionPath);
    const config = new Config(context);
    if (!config.shouldUpdate(context)) {
      return;
    }
    const filename = getFileName(extensionName);
    const file = await this._fileDownloader.downloadFile(Uri.parse(url), filename, context);
    log(`Checking update for extension ${extensionName} from ${url}`);
    if (await this.verifyVersion(file, context)) {
      log(`Updating extension ${extensionName}`);
      await vscode.commands.executeCommand('workbench.extensions.installExtension', file);
      log(`Extension ${extensionName} updated`);
      await this._fileDownloader.deleteItem(filename, context);
    } else {
      log(`No update for extension ${extensionName} from ${url}`);
    }

    config.lastCheckedDate = new Date();
  }

  private async verifyVersion(file: Uri, context: ExtensionContext): Promise<boolean> {
    const zipPromise = new Promise<any>((resolve, reject) => {
      const zip = new streamZip({ file: file.fsPath, storeEntries: true });
      zip.on('ready', () => {
        const zipDotTxtContents = zip.entryDataSync('extension/package.json').toString('utf8');
        resolve(JSON.parse(zipDotTxtContents));
        zip.close();
      });
      zip.on('error', error => {
        reject(error);
      });
    });
    const newPkg = await zipPromise;
    const packageJsonPath = path.join(context.extensionPath, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const { name, displayName, publisher, version } = packageJson;
    const { name: newName, publisher: newPublisher, version: newVersion } = newPkg;
    if (name !== newName) {
      throw new Error(`Package name mismatch. Expected ${name} but got ${newName}. Update aborted.`);
    }
    if (Boolean(publisher) && Boolean(newPublisher) && publisher !== newPublisher) {
      throw new Error(`Package publisher mismatch. Expected ${publisher} but got ${newPublisher}. Update aborted.`);
    }
    if (newVersion !== version) {
      log(`New Version Found for extension ${displayName} (${name}): ${newVersion}`);
      return true;
    }
    return false;
  }
}

/**
 * Convert extension name to a valid file name
 * @returns {string} file name
 */
function getFileName(extensionName: string): string {
  return `${extensionName.replace(/[^A-Za-z0-9-]/g, '-')}.vsix`;
}

/**
 * Validate extension context
 * @param context extension context
 * @returns {boolean} true if valid, false otherwise
 */
function isValidExtensionContext(context: any): context is vscode.ExtensionContext {
  return (
    Boolean(context) &&
    typeof context === 'object' &&
    'extensionPath' in context &&
    typeof context.extensionPath === 'string' &&
    'globalState' in context &&
    typeof context.globalState === 'object' &&
    'workspaceState' in context &&
    typeof context.workspaceState === 'object' &&
    'subscriptions' in context &&
    Array.isArray(context.subscriptions) &&
    'globalStorageUri' in context &&
    context.globalStorageUri instanceof vscode.Uri &&
    'logUri' in context &&
    context.logUri instanceof vscode.Uri &&
    'storageUri' in context &&
    (context.storageUri === undefined || context.storageUri instanceof vscode.Uri) &&
    'extensionUri' in context &&
    context.extensionUri instanceof vscode.Uri &&
    'asAbsolutePath' in context &&
    typeof context.asAbsolutePath === 'function'
  );
}
