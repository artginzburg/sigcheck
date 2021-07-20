const puppeteer = require('puppeteer');

const runParser = require('./utils/runParser.js');

const uslugi = require('./uslugi.js');
const cryptoPro = require('./cryptoPro.js');

const { puppeteerLaunchOptions } = require('./constants.js');

async function getSigns() {
  const browser = await puppeteer.launch(puppeteerLaunchOptions);

  const result = {};

  // console.log('Running cryptoPro...');
  result.cryptoPro = await runParser(cryptoPro, browser);

  // console.log('\n');

  // console.log('Running uslugi...');
  result.gosUslugi = await runParser(uslugi, browser);

  console.log('сука результат подо мной');
  console.log(result);

  return result;
}

module.exports = getSigns;
