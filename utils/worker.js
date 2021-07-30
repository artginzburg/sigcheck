const { createWorker } = require('tesseract.js');

const language = 'eng';
const captchaSymbols = '0123456789';

const worker = createWorker({
  cacheMethod: 'readOnly',
});

worker.configuredLoad = async () => {
  await worker.load();
  await worker.loadLanguage(language);
  await worker.initialize(language);
  await worker.setParameters({
    tessedit_char_whitelist: captchaSymbols,
    tessedit_pageseg_mode: ['PSM_SINGLE_WORD'],
  });

  return worker;
};

module.exports = worker;
