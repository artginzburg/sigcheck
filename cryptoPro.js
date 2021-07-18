const puppeteer = require('puppeteer');
const { testFolder } = require('./constants.js');

const resultSelector = '#server-errors';
const errorText = 'Произошла ошибка при проверке документа';

module.exports = async function cryptoPro() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://www.justsign.me/verifyqca/Verify/');

  const fileInput = await page.$('input[name="SignatureFile"]');
  await fileInput.uploadFile(`${testFolder}test.sig`);

  const submitButton = await page.$('#verify-button');
  submitButton.click();

  await page.waitForSelector(resultSelector, {
    timeout: 5000,
  });
  const resultElement = await page.$(resultSelector);
  const resultValue = await page.evaluate((el) => el.textContent, resultElement);
  browser.close();

  if (!resultValue) {
    throw 'Не удалось получить контект поля результата';
  }

  const resultIsError = resultValue.includes(errorText);

  const result = {
    status: !resultIsError,
  };

  if (!resultIsError) {
    const readableResult = resultValue.split('Владелец :')[1].split('Издатель')[0];
    result.sgn = readableResult;
  }

  return result;
};
