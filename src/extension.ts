import { getApi } from '@microsoft/vscode-file-downloader-api';
import { ExtensionContext } from 'vscode';
import { AutoUpdater } from './updater';

export const activate = async (_context: ExtensionContext) => {
  const downloader = await getApi();
  return new AutoUpdater(downloader);
};
