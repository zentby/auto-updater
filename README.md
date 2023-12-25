# Auto Updater

## Overview

The extension expose an API for private extension publisher to update their extension automatically. This would be useful when you want to publish your extension privately and don't want to publish it to the VS Code Marketplace.

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

## Requirements

The extension is using Microsoft's VS Code File Downloader `"mindaro-dev.file-downloader"` under the hood. So you need to have it installed in your VS Code. (It should be automatically installed when you install this extension)

> Note: The extension only update extension that matchese the publisher name and extension name in the URL. So make sure you have the correct publisher name and extension name in the URL.

The extension doesn't solve the distribution issue. So you still need to ask the users to manual install your extension for the first time. This can be done either from [VS Code UI](https://code.visualstudio.com/docs/editor/extension-gallery#_install-from-a-vsix) or from command line `code --install-extension your-extension.vsix`. If you add the check update function in your extension's activation function, then the extension will be updated automatically when there is a new version.

## License

This project is licensed under the MIT License.

