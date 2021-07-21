### For macOS to stop showing the puppeteer firewall popup:

```powershell
sudo codesign --force --deep --sign - ./node_modules/puppeteer/.local-chromium/
```

Press <kbd>Tab</kbd> 3 times · <kbd>Enter</kbd>

> On the next Chromium launch, click `Allow` in the popup.

Reference: [https://github.com/puppeteer/puppeteer/issues/4752](puppeteer#4752)
