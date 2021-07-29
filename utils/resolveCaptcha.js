const { createWorker } = require('tesseract.js');
const worker = createWorker();

const baseUrl = 'https://www.gosuslugi.ru';
const captchaUrl = new URL('/pgu/captcha/get', baseUrl);

const captchaLength = 5;
const captchaSymbols = '0123456789';

const workerLanguage = 'eng';

const resolveThroughWorker = async (url) => {
  await worker.load();
  await worker.loadLanguage(workerLanguage);
  await worker.initialize(workerLanguage);
  await worker.setParameters({
    tessedit_char_whitelist: captchaSymbols,
  });

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
