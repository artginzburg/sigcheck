### For macOS to stop showing the puppeteer firewall popup:

Follow instructions at [artginzburg/puppeteer-chromium-macOS-Firewall-popup-stop.md](https://gist.github.com/artginzburg/3b8aa0a8d394b12d7326ee761eddfc2f)

### To send a file for test

```powershell
cd testSigs/valid
curl -vF toCheck=@test.sig http://localhost:6969/check
```

### To send multiple files for test

```powershell
cd testSigs/valid
curl -vF toCheck=@forTwo.sig -F toCheck=@forTwo.pdf http://localhost:6969/check
```
