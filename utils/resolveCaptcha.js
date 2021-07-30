const worker = require('./worker');

const baseUrl = 'https://www.gosuslugi.ru';
const captchaUrl = new URL('/pgu/captcha/get', baseUrl);

const captchaLength = 5;

const resolveThroughWorker = async (url) => {
  await worker.configuredLoad();

  const {
    data: { text },
  } = await worker.recognize(url);

  return text;
};

const resolved = async (id) => {
  const imageToResolve = captchaUrl;
  imageToResolve.searchParams.set('id', id);
  return await resolveThroughWorker(imageToResolve.href);
};

const resolveCaptcha = async (id) => {
  do {
    var captchaAnswer = await resolved(id);
    var res = captchaAnswer.trim();
    captchaAnswer = res + '\n';
  } while (!(res.length === captchaLength));

  return { captchaAnswer };
};

module.exports = {
  resolveCaptcha,
};
