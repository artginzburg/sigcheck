const config = {
  testFolder: './files/',
  activeParsers: ['cryptoPro', 'gosUslugi' ],
  maximumPing: 3000,
  retryCaptcha: 10,
  puppeteerLaunchOptions: {
    // headless: false,
  },
};

module.exports = config;
