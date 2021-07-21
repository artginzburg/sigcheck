const { createWorker } = require('tesseract.js');
const worker = createWorker({});

const resolveCaptcha = async (url) => {
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

module.exports = {
  resolveCaptcha,
  resolved,
  val,
};
