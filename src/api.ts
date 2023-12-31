import * as vscode from 'vscode';
import { IAutorUpdater } from './types';

let _extension: vscode.Extension<IAutorUpdater> | undefined;
export const getApi = async (): Promise<IAutorUpdater> => {
  if (!_extension) {
    const extension = vscode.extensions.getExtension('yangzhao.auto-updater');
    if (extension == null) {
      throw new Error('Failed to get Auto Updater VS Code extension.');
    }
    _extension = extension;
  }
  if (!_extension.isActive) {
    await _extension.activate();
  }
  return _extension.exports;
};
