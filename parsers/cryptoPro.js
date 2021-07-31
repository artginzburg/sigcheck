const { getFileNames } = require('../utils/getAllFilesNames');

const { maximumPing } = require('./config');
const sortByExtension = require('./sortByExtension');

const errorSelector = '#server-errors';
const resultCheckerSelector = 'label[for="VerificationResults_0__Parameters_0__Description"]';
const errorText = 'Произошла ошибка при проверке документа';

const waitForSelectors = async (page, arr, ...rest) =>
  await page.waitForSelector(arr.filter(Boolean).join(','), ...rest);

module.exports = async function cryptoPro(browser, count, pathName, index) {
  const files = getFileNames(pathName);
  const page = await browser.newPage();

  await page.goto('https://www.justsign.me/verifyqca/Verify/');

  const filenames = sortByExtension(files);

  const fileInput = await page.$('input[name="SignatureFile"]');
  await fileInput.uploadFile(`${pathName}${filenames.sig}`);

  if (filenames.pdfOrJpg) {
    await page.click('a[href="#signature-parameters"]');

    await page.waitForTimeout(200);

    const detachedTrueSelector = 'input[name="Detached"][value="true"]';
    await page.waitForSelector(detachedTrueSelector, {
      timeout: 500,
    });
    await page.click(detachedTrueSelector);

    const detachedOpenerSelector = 'a[href="#signature-document"]';
    await page.waitForSelector(detachedOpenerSelector, {
      timeout: 500,
    });
    await page.click(detachedOpenerSelector);

    const fileInput2Element = await page.$('input[name="DocumentFile"]');

    const fileInput2 = await page.evaluateHandle((el) => el.nextElementSibling, fileInput2Element);
    await fileInput2.uploadFile(`${pathName}${filenames.pdfOrJpg}`);
  }

  await page.click('#verify-button');

  await waitForSelectors(page, [resultCheckerSelector, errorSelector], {
    timeout: maximumPing,
  });

  const errorElement = await page.$(errorSelector);

  const thereIsNoError = errorElement ? false : true;

  let readableResult = '';

  if (thereIsNoError) {
    const subjectElement = await page.$(
      'label[for="VerificationResults_0__CertificateInfo_SubjectName"]'
    );

    const subjectValue = await page.evaluate((el) => el.parentElement.textContent, subjectElement);
    const subject = subjectValue.split('Субъект')[1].trim();
    // const allStatus = await page.$('div[class=readableResult]');

    readableResult = subject;
    const result = {
      status: 'true',
    };
    result.sgn = readableResult;
    await page.close();
    return result;
  } else {
    const errorValue = await page.evaluate((el) => el.textContent, errorElement);

    if (!errorValue) {
      console.error('Не удалось получить контент поля ошибки');
    }
    const signIsFalse = errorValue && errorValue.includes(errorText);

    const result = {
      status: !signIsFalse,
    };

    if (!signIsFalse) {
      result.sgn = readableResult;
    }
    await page.close();
    return result;
  }
};
