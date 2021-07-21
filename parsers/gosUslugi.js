const resolveCaptcha = require('../utils/resolveCaptcha.js');
const getAllFilesNames = require('../utils/getAllFilesNames.js');

const { testFolder, maximumPing, retryCaptcha } = require('../config.js');

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

const gosUslugi = async (browser, count = 1) => {
  const namesArePdfSig = getAllFilesNames() === 'pdfsig';
  const captchaNumber = namesArePdfSig ? 3 : 2;

  const page = await browser.newPage();

  await page.setViewport({
    width: 1366,
    height: 768,
  });
  await page.setUserAgent(
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'
  );

  await page.goto('https://www.gosuslugi.ru/pgu/eds');

  const currentActionLink = await page.$('a[name="currentAction"]');
  if (!currentActionLink && count == 1) {
    throw 'На странице госуслуг отсутствует необходимая кнопка (ссылка)';
  }

  currentActionLink && (await currentActionLink.click());
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

    // const serverErrorSelector = '.b-error';

    // try {
    //   const isServerError = await page.waitForSelector(serverErrorSelector, {
    //     timeout: 300,
    //   });

    //   if (isServerError) {
    //     throw 'Ошибка на стороне сервера госуслуг';
    //   }
    // } catch (error) {
    //   throw error;
    // }

    try {
      await page.waitForSelector('#elsign-result', {
        timeout: maximumPing,
      });
    } catch (err) {
      throw 'Капча провалена';
    }

    const resultElement = await page.$('#elsign-result');
    const resultValue = await page.evaluate((el) => el.textContent, resultElement);

    await page.close();

    const resultIsError = resultValue.replace(/\r?\n| /g, '').includes('НЕПОДТВЕРЖДЕНА');

    const result = {
      status: !resultIsError,
    };

    if (!resultIsError) {
      result.sgn = resultValue.split('Владелец :')[1].split('Издатель')[0].trim();
    }

    return result;
  } catch (error) {
    await page.close();
    if (count > retryCaptcha) {
      console.log(`Провалил ${count} раз подряд, закругляюсь.`, error);
      return { status: 'error' };
    } else {
      console.log(error, 'Попробую снова.');
      return await gosUslugi(browser, count + 1);
    }
  }
};

module.exports = gosUslugi;
