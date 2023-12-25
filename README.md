# Auto Updater

## Overview

The extension expose an API for private extension publisher to update their extension automatically. (e.g. your extension is published in your company's private website)

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

## License

This project is licensed under the MIT License.

