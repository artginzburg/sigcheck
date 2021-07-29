const puppeteer = require('puppeteer');

const runParser = require('./utils/runParser');

const { puppeteerLaunchOptions, activeParsers } = require('./parsers/config');

async function getSigns(pathName) {
  const browser = await puppeteer.launch(puppeteerLaunchOptions);
  const result = {};
  for await (const parser of activeParsers) {
    console.log(`Running ${parser}...`);
    result[parser] = await runParser(require(`./parsers/${parser}`), browser, pathName);
  }

  await browser.close();

  console.log('Sent result: ', result);
  return result;
}

module.exports = getSigns;
