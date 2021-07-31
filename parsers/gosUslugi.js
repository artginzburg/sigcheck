const { resolveCaptcha } = require('../utils/resolveCaptcha');
const { getFileNames, filesArePdfOrJpgSig } = require('../utils/getAllFilesNames');

const { maximumPing, retryCaptcha } = require('./config');
const sortByExtension = require('./sortByExtension');

module.exports = async function gosUslugi(browser, count = 1, pathName, index) {
  const files = getFileNames(pathName);
  const namesArePdfSig = filesArePdfOrJpgSig(files);
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

  console.log(
    `Я реквест номер ${index} (try ${count}), подтверждаю, что не проебался почти в самом начале госуслуг`
  );

  const currentActionLink = await page.$('a[name="currentAction"]');
  if (!currentActionLink && count == 1) {
    console.error('На странице госуслуг отсутствует необходимая кнопка (ссылка)');
  }

  currentActionLink && (await currentActionLink.click());
  await page.click(`span[rel="${captchaNumber}"]`);

  const images = await page.$$eval('.captcha-img', (anchors) =>
    [].map.call(anchors, (img) => img.src)
  );

  const id = images[0].split('id=')[1];

  console.log(`Я реквест номер ${index} (try ${count}), подтверждаю, что не проебался перед траем`);

  try {
    console.log(`Я реквест номер ${index} (try ${count}), подтверждаю, что зашёл в трай`);
    const resolved = await resolveCaptcha(id, index, count);

    console.log(`Resolved: ${index} (try ${count})`, resolved);

    const filenames = sortByExtension(files);

    if (namesArePdfSig) {
      const fileInput = await page.$('input[name="docSignature"]');
      await fileInput.uploadFile(`${pathName}${filenames.pdfOrJpg}`);

      const fileInput2 = await page.$('input[name="docDocument"]');
      await fileInput2.uploadFile(`${pathName}${filenames.sig}`);
    } else {
      const fileInput = await page.$('input[name="document"]');
      await fileInput.uploadFile(`${pathName}${filenames.sig}`);
    }

    await page.type(`#captchaAnswer${captchaNumber}`, resolved.captchaAnswer, {
      delay: 10,
    });

    try {
      await page.waitForSelector('#elsign-result', {
        timeout: maximumPing,
      });
    } catch (err) {
      throw `Капча провалена (${index}).`;
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
    console.log(`Я реквест номер ${index} (try ${count}), папал в кеч памагите!`);
    await page.close();
    if (count > retryCaptcha) {
      console.log(`Провалил ${count} раз подряд, закругляюсь.`, error);
      return { status: 'error' };
    } else {
      console.log(error, 'Попробую снова.');
      return gosUslugi(browser, count + 1, pathName, index);
    }
  }
};
