# Extension Auto Updater

The extension expose an API for private extension publisher to update their extension automatically. This would be useful when you want to publish your extension privately and don't want to publish it to the VS Code Marketplace. E.g. In a large organization/enterprise, you may have your own extensions that are not published to the marketplace. You can use this extension to install those extensions.

The extension would work better with [Extension Auto Installer](https://marketplace.visualstudio.com/items?itemName=yangzhao.auto-installer) extension. You can use the auto installer to install your extension for the first time and then use this api to continuously update your extension.

🟩 [Extension Auto Installer](https://marketplace.visualstudio.com/items?itemName=yangzhao.auto-installer) will install the extensions. - Private Distribution
<br/>
✅ Extension Auto Updater (this extension) will manage the future updates for your extensions. - Continuous Delivery

**If your extension intend to publish to VSCode maketplace, you don't need to integrate this extension.**

## Getting Started

> You need to have your URL for the extension's latest version and the `.vsix` file download link.

Place the following in your VS Code extension's package.json file:

```json
"extensionDependencies": [
    "yangzhao.auto-updater"
]
```

Then, in your extension's function to check update(e.g. `checkUpdate`), add the following:

```ts
const updater = vscode.extensions.getExtension("yangzhao.auto-updater");
if (updater) {
  updater.activate().then(() => {
    updater.exports.update(
      "your-extension-latest-version-url",
      extensionContext
    );
  });
}
```

**Note: if the extension is not auto-installed with you extension, add the following code in your checking logic to install it**;

```ts
let updater = vscode.extensions.getExtension("yangzhao.auto-updater");
if (!updater) {
  await vscode.commands.executeCommand(
    "workbench.extensions.installExtension",
    "yangzhao.auto-updater"
  );
  updater = vscode.extensions.getExtension("yangzhao.auto-updater");
}
```

## Configurations

- Option `auto-updater.check-frequency` - The frequency to check for updates. Default is 0 (days) which means every time the main extension is activated the updater will check for updates. **Recommend only change it if the checking is too heavy.**

- Option `auto-updater.disabled` - Disable the auto updater. Default is false. If the updater is disabled, no updates will be checked.


## Requirements

The extension is using Microsoft's VS Code File Downloader `"mindaro-dev.file-downloader"` under the hood. So you need to have it installed in your VS Code. (It should be automatically installed when you install this extension)

> Note: The extension only update extension that matchese the publisher name and extension name in the URL. So make sure you have the correct publisher name and extension name in the URL.

The extension doesn't solve the distribution issue. So you still need to ask the users to manual install your extension for the first time. There are 3 ways of doing it:

- [Extension Auto Installer](https://marketplace.visualstudio.com/items?itemName=yangzhao.auto-installer) is the another extension that supports to install from URL or local path (e.g. from an internal web server, your workspace).
- Manually install from [VS Code UI](https://code.visualstudio.com/docs/editor/extension-gallery#_install-from-a-vsix)
- Install via command line `code --install-extension your-extension.vsix`


## Release Notes

See [CHANGELOG](./CHANGELOG.md) section.

## License

This project is licensed under the MIT License.

