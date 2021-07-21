const puppeteer = require('puppeteer');

const runParser = require('./utils/runParser.js');

const { puppeteerLaunchOptions, activeParsers } = require('./constants.js');

async function getSigns() {
  const browser = await puppeteer.launch(puppeteerLaunchOptions);

  const result = {};
  for await (const parser of activeParsers) {
    console.log(`Running ${parser}...`);
    result[parser] = await runParser(require(`./${parser}.js`), browser);
  }

  await browser.close();

  console.log('Sent result: ', result);
  return result;
}

module.exports = getSigns;
