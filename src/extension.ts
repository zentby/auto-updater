import { getApi } from "@microsoft/vscode-file-downloader-api";
import { AutoUpdater } from "./updater";

export const activate = async  () => {
    const downloader = await getApi();
    return new AutoUpdater(downloader);
};
