const { createWorker } = require('tesseract.js');

const workerLanguage = 'eng';
const captchaSymbols = '0123456789';

const worker = createWorker();

async function workerConfiguredLoad() {
  await worker.load();
  await worker.loadLanguage(workerLanguage);
  await worker.initialize(workerLanguage);
  await worker.setParameters({
    tessedit_char_whitelist: captchaSymbols,
  });
}

module.exports = {
  workerConfiguredLoad,
  worker,
};
