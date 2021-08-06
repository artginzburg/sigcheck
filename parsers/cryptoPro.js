const FormData = require('form-data');
const fs = require('fs');

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

  // Allows you to intercept a request; must appear before
  // your first page.goto()
  await page.setRequestInterception(true);

  // Request intercept handler... will be triggered with
  // each page.goto() statement
  page.once('request', (interceptedRequest) => {
    const form = new FormData();

    const filenames = sortByExtension(files);

    form.append('action', 'Проверить');

    const file1 = fs.readFileSync(`${pathName}${filenames.sig}`);
    form.append('SignatureFile', file1, { filename: filenames.sig });

    form.append('SignatureType', 'CMS');

    form.append('Detached', filenames.pdfOrJpg ? 'true' : 'false');

    if (filenames.pdfOrJpg) {
      form.append('Hash', 'false');
    }
    form.append('HashAlgorithm', 'GOST R 34.11-94');

    if (filenames.pdfOrJpg) {
      const file2 = fs.readFileSync(`${pathName}${filenames.pdfOrJpg}`);
      form.append('DocumentFile', file2, { filename: filenames.pdfOrJpg });
    } else {
      form.append('DocumentFile', '');
    }

    form.append('CertificateFile', '');

    const data = {
      method: 'POST',
      postData: form.getBuffer(),
      headers: {
        ...interceptedRequest.headers(),
        'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
      },
    };

    interceptedRequest.continue(data);

    page.setRequestInterception(false);
  });

  await page.goto('https://www.justsign.me/verifyqca/Verify/');

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
      status: true,
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
