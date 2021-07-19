const puppeteer = require('puppeteer');
const fs = require('fs');

const resolveCaptcha = require('./utils/resolveCaptcha.js');

const { testFolder, maximumPing, puppeteerLaunchOptions } = require('./constants.js');

const getAllFilesNames = () => {
  let files = fs.readdirSync(testFolder);
  if (
    files.length == 1 &&
    !(files.filter((file) => !['sig', 'pdf'].includes(file.split('.')[1])).length > 0)
  ) {
    return 'sig';
  } else if (
    files.length == 2 &&
    !(files.filter((file) => !['sig', 'pdf'].includes(file.split('.')[1])).length > 0)
  ) {
    console.log('her2');
    return 'pdfsig';
  } else {
    return 'tosig';
  }
};

const resolved = async (id) => ({
  captchaAnswer: await resolveCaptcha(`https://www.gosuslugi.ru/pgu/captcha/get?id=${id}`),
  captchaId: id,
});

const val = async (id) => {
  do {
    final = await resolved(id);
    res = final.captchaAnswer;
    if (res.length === 6) {
      break;
    }
  } while (!(res.length === 5));

  return {
    ...final,
    captchaId: id,
  };
};

const uslugi = async (count = 1) => {
  const namesArePdfSig = getAllFilesNames() === 'pdfsig';
  const captchaNumber = namesArePdfSig ? 3 : 2;

  const browser = await puppeteer.launch(puppeteerLaunchOptions);
  const page = await browser.newPage();

  await page.setViewport({
    width: 1366,
    height: 768,
  });
  await page.setUserAgent(
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'
  );

  await page.goto('https://www.gosuslugi.ru/pgu/eds');
  await page.click('a[name="currentAction"]');
  await page.click(`span[rel="${captchaNumber}"]`);

  const images = await page.$$eval('.captcha-img', (anchors) =>
    [].map.call(anchors, (img) => img.src)
  );

  const id = images[0].split('id=')[1];

  const resolved = await val(id);

  if (namesArePdfSig) {
    const fileInput = await page.$('input[name="docSignature"]');
    await fileInput.uploadFile(`${testFolder}test.pdf`);

    const fileInput2 = await page.$('input[name="docDocument"]');
    await fileInput2.uploadFile(`${testFolder}test.sig`);
  } else {
    const fileInput = await page.$('input[name="document"]');
    await fileInput.uploadFile(`${testFolder}test.sig`);
  }

  try {
    await page.type(`#captchaAnswer${captchaNumber}`, resolved.captchaAnswer, {
      delay: 10,
    });

    try {
      await page.waitForSelector('#elsign-result', {
        timeout: maximumPing,
      });
    } catch (err) {
      throw 'Капча провалена';
    }

    const resultElement = await page.$('#elsign-result');
    const resultValue = await page.evaluate((el) => el.textContent, resultElement);

    browser.close();

    if (namesArePdfSig) {
      return resultValue;
    }

    const resultIsError = resultValue.replace(/\r?\n| /g, '').includes('НЕПОДТВЕРЖДЕНА');

    const result = {
      status: !resultIsError,
    };

    if (!resultIsError) {
      result.sgn = resultValue.split('Владелец :')[1].split('Издатель')[0];
    }

    return result;
  } catch (error) {
    if (count > 2) {
      console.log(`Провалил ${count} раз подряд, закругляюсь.`, error);
    } else {
      console.log(error, 'Попробую снова.');
      return await uslugi(count + 1);
    }
  }
};

module.exports = uslugi;
