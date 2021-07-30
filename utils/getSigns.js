const puppeteer = require('puppeteer');

const runParser = require('./runParser');

const { puppeteerLaunchOptions, activeParsers } = require('../parsers/config');

async function getSigns(pathName, index) {
  const browser = await puppeteer.launch(puppeteerLaunchOptions);
  const result = {};

  // console.log('Running parsers...');
  for await (const parser of activeParsers) {
    result[parser] = await runParser(
      require(`../parsers/${parser}`),
      browser,
      pathName,
      parser,
      index
    );
  }

  const status =
    result.cryptoPro && result.gosUslugi
      ? result.cryptoPro.status && result.gosUslugi.status
      : result.cryptoPro
      ? result.cryptoPro.status
      : result.gosUslugi.status;

  await browser.close();

  const answer = {
    status,
    details: result,
  };

  return answer;
}

module.exports = getSigns;
