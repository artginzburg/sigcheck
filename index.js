const { createWorker } = require("tesseract.js");

const worker = createWorker({});
const puppeteer = require("puppeteer");

const resolveCaptcha = async (url) => {
  await worker.load();
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
  await worker.setParameters({
    tessedit_char_whitelist: "0123456789",
  });

  const {
    data: { text },
  } = await worker.recognize(url);

  return text;
};

const resolved = async (id) => {
  return {
    captchaAnswer: await resolveCaptcha(
      "https://www.gosuslugi.ru/pgu/captcha/get?id=" + id
    ),
    captchaId: id,
  };
};
const val = async (id) => {
  do {
    final = await resolved(id);
    res = (await resolved(id)).captchaAnswer;
    if (res.length == 6) {
      break;
    }
  } while (!(res.length == 5));

  return {
    ...final,
    captchaId: id,
  };
};

(async () => {
  let launchOptions = { headless: true, args: ["--start-maximized"] };

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();

  // set viewport and user agent (just in case for nice viewing)
  await page.setViewport({ width: 1366, height: 768 });
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
  );

  await page.goto("https://www.gosuslugi.ru/pgu/eds");
  await page.evaluate(() => {
    document.querySelector('a[name="currentAction"]').click();
    document.querySelector('span[rel="3"]').click();
  });
  const images = await page.$$eval(".captcha-img", (anchors) =>
    [].map.call(anchors, (img) => img.src)
  );
  const id = images[0].split("id=")[1];
  val(id).then(async (resolved) => {
    const fileInput = await page.$('input[name="docSignature"]');
    await fileInput.uploadFile("./test.pdf");
    const fileInput2 = await page.$('input[name="docDocument"]');
    await fileInput2.uploadFile("./test.sig");
    await page.type("#captchaAnswer3", resolved.captchaAnswer, { delay: 100 });
    page.waitForSelector("#elsign-result").then(async () => {
      let element = await page.$("#elsign-result");
      let value = await page.evaluate((el) => el.textContent, element);
      console.log(value);
    });
  });

  await browser.close();
})();
