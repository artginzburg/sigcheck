const puppeteer = require("puppeteer");

const runParser = require("./utils/runParser.js");

const { puppeteerLaunchOptions, activeParsers } = require("./config.js");

async function getSigns(pathName) {
  const browser = await puppeteer.launch(puppeteerLaunchOptions);
  const result = {};
  for await (const parser of activeParsers) {
    console.log(`Running ${parser}...`);
    result[parser] = await runParser(
      require(`./parsers/${parser}.js`),
      browser,
      pathName
    );
  }

  await browser.close();

  console.log("Sent result: ", result);
  return result;
}

module.exports = getSigns;
