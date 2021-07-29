const puppeteer = require('puppeteer');

const runParser = require('../../utils/runParser');

const { puppeteerLaunchOptions, activeParsers } = require('../../parsers/config');

async function getSigns(pathName) {
  const browser = await puppeteer.launch(puppeteerLaunchOptions);
  const result = {};
  for await (const parser of activeParsers) {
    console.log(`Running ${parser}...`);
    result[parser] = await runParser(require(`../../parsers/${parser}`), browser, pathName);
  }

  await browser.close();

  const answer = {
    status: result.cryptoPro.status && result.gosUslugi.status,
    details: result,
  };

  return answer;
}

module.exports = getSigns;
