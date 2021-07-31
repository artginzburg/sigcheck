const worker = require('./worker');

const baseUrl = 'https://www.gosuslugi.ru';
const captchaUrl = new URL('/pgu/captcha/get', baseUrl);

const captchaLength = 5;

const resolveCaptcha = async (id, index, count) => {
  const imageToResolve = captchaUrl;
  imageToResolve.searchParams.set('id', id);

  const url = imageToResolve.href;

  await worker.configuredLoad();

  console.log(`реквест ${index} (try ${count}) всё ещё тут, после загрузки воркера`);

  console.log(`реквест ${index} (try ${count}) ещё не проебался после дувайл`);

  return {
    captchaAnswer: await (async () => {
      // Вот здесь проёбывается запрос, в цикле дувайл
      do {
        var {
          data: { text },
        } = await worker.recognize(url);
        var res = text.trim();
      } while (res.length !== captchaLength);

      return text;
    })(),
  };
};

module.exports = {
  resolveCaptcha,
};
