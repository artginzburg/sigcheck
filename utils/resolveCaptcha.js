const { createWorker } = require('tesseract.js');
const worker = createWorker({});

const resolveThroughWorker = async (url) => {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  await worker.setParameters({
    tessedit_char_whitelist: '0123456789',
  });

  const {
    data: { text },
  } = await worker.recognize(url);

  return text;
};

const resolved = async (id) =>
  await resolveThroughWorker(`https://www.gosuslugi.ru/pgu/captcha/get?id=${id}`);

const resolveCaptcha = async (id) => {
  do {
    var captchaAnswer = await resolved(id);
    var res = captchaAnswer.trim();
    captchaAnswer = res + '\n';
  } while (!(res.length === 5));

  return { captchaAnswer };
};

module.exports = {
  resolveCaptcha,
};
