const parserConfig = {
  testFolder: './files/',
  activeParsers: ['cryptoPro', 'gosUslugi'],
  maximumPing: 5000,
  retryCaptcha: 9,
  puppeteerLaunchOptions: {
    // headless: false,
  },
};

module.exports = parserConfig;
