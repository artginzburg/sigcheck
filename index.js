const puppeteer = require('puppeteer');

const runParser = require('./utils/runParser.js');

const uslugi = require('./uslugi.js');
const cryptoPro = require('./cryptoPro.js');

const { puppeteerLaunchOptions } = require('./constants.js');

async function test() {
  const browser = await puppeteer.launch(puppeteerLaunchOptions);

  console.log('Running cryptoPro...');
  await runParser(cryptoPro, browser);

  console.log('\n');

  console.log('Running uslugi...');
  await runParser(uslugi, browser);

  process.exit();
}
test();
