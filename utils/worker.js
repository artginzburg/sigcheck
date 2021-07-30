const { createWorker, PSM } = require('tesseract.js');

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
    tessedit_pageseg_mode: PSM.SINGLE_WORD,
    preserve_interword_spaces: '0',
  });

  return worker;
};

module.exports = worker;
