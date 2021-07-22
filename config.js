const config = {
  testFolder: "./files/",
  activeParsers: ["cryptoPro", "gosUslugi"],
  maximumPing: 5000,
  retryCaptcha: 9,
  puppeteerLaunchOptions: {
    // headless: false,
  },
};

module.exports = config;
