import path from 'path';
import * as vscode from 'vscode';
import { log } from './logger';

const disabledKey = `disabled`;
const checkFrequencyKey = `check-frequency`;
const lastCheckedDateKey = `last-checked-date`;
export class Config {
    private _context: vscode.ExtensionContext;

    public constructor(context: vscode.ExtensionContext) {
        this._context = context;
        log(`[Config]: Auto Updater disabled: ${this.disabled}`);
        log(`[Config]: Check frequency: ${this.checkFrequency} days`);
        log(`[Config]: Last checked date: ${this.lastCheckedDate}`);
    }

    public get disabled(): boolean {
        const config = vscode.workspace.getConfiguration(`auto-updater`);
        return config.get(disabledKey, false);
    }
    public get checkFrequency(): number {
        const config = vscode.workspace.getConfiguration(`auto-updater`);
        return config.get(checkFrequencyKey, 7); // Default value is 7 days
    }

    public get lastCheckedDate(): Date  {
        const timestamp = this._context.globalState.get<number>(lastCheckedDateKey, 0);
        return new Date(timestamp);
    }

    public set lastCheckedDate(value: Date | null) {
        const timestamp = value ? value.getTime() : null;
        this._context.globalState.update(lastCheckedDateKey, timestamp);
    }

    /**
     * Check if update should be performed
     * @param context
     * @returns {boolean} true if update should be performed, false otherwise
     */
    public shouldUpdate(context: vscode.ExtensionContext): boolean{
        const extensionName = path.basename(context.extensionPath);
        if (this.disabled){
            log(`Extension ${extensionName} update skipped. Auto updater disabled.`);
            return false;
        }
        if (this.lastCheckedDate.getTime() + this.checkFrequency * 20 * 60 * 60 * 1000 > Date.now()) {
            log(`Extension ${extensionName} update skipped. Last checked date: ${this.lastCheckedDate}`);
            return false;
        }

        return true;
    }
}
