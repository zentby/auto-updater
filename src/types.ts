import { ExtensionContext } from "vscode";

export interface IAutorUpdater {
    update(url: string, context: ExtensionContext): Promise<void>;
}
