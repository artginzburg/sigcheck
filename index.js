const {
  createWorker
} = require("tesseract.js");
const fs = require('fs')


const testFolder = './files/';

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
    data: {
      text
    },
  } = await worker.recognize(url);

  return '11111';
};

const getAllFilesNames = () => {
  let files = fs.readdirSync(testFolder)
  if ((files.length == 1) && !(files.filter(file => !(['sig', 'pdf'].includes(file.split('.')[1]))).length > 0)) {
    return 'sig'
  } else if (files.length == 2 && !(files.filter(file => !(['sig', 'pdf'].includes(file.split('.')[1]))).length > 0)) {
    console.log('her2');
    return 'pdfsig'
  } else {
    return 'tosig'
  }

}



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


const uslugi = async (count = 1) => {
  if (getAllFilesNames() == 'pdfsig') {
    {
      let launchOptions = {
        headless: false,
        args: ["--start-maximized"]
      };

      const browser = await puppeteer.launch(launchOptions);

      const page = await browser.newPage();

      await page.setViewport({
        width: 1366,
        height: 768
      });
      await page.setUserAgent(
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
      );

      await page.goto("https://www.gosuslugi.ru/pgu/eds");
      await page.evaluate(() => {
        document.querySelector('a[name="currentAction"]').click();
        document.querySelector('span[rel="3"]').click();
      });

      const images = await page.$$eval(".captcha-img", (anchors) => [].map.call(anchors, (img) => img.src));

      const id = images[0].split("id=")[1];

      val(id).then(async (resolved) => {
        const fileInput = await page.$('input[name="docSignature"]');
        await fileInput.uploadFile("./files/test.pdf");
        const fileInput2 = await page.$('input[name="docDocument"]');
        await fileInput2.uploadFile("./files/test.sig");
        await page.type("#captchaAnswer3", resolved.captchaAnswer, {
          delay: 100,
        });

        page.waitForSelector("#elsign-result", {
          timeout: 5000
        }).then(async () => {
          let element = await page.$("#elsign-result");
          let value = await page.evaluate((el) => el.textContent, element);
          return value;
        }).catch(e => {
          console.log('ОШИИИБКА');
          uslugi()
        })



      });
    }
  } else {
    {
      let launchOptions = {
        headless: false,
        args: ["--start-maximized"]
      };

      const browser = await puppeteer.launch(launchOptions);

      const page = await browser.newPage();

      await page.setViewport({
        width: 1366,
        height: 768
      });
      await page.setUserAgent(
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
      );

      await page.goto("https://www.gosuslugi.ru/pgu/eds");
      await page.evaluate(() => {
        document.querySelector('a[name="currentAction"]').click();
        document.querySelector('span[rel="2"]').click();
      });

      const images = await page.$$eval(".captcha-img", (anchors) => [].map.call(anchors, (img) => img.src));

      const id = images[0].split("id=")[1];

      val(id).then(async (resolved) => {
        const fileInput = await page.$('input[name="document"]');
        await fileInput.uploadFile("./files/test.sig");

        await page.type("#captchaAnswer2", resolved.captchaAnswer, {
          delay: 100,
        });

        page.waitForSelector("#elsign-result", {
          timeout: 5000
        }).then(async () => {

          let element = await page.$("#elsign-result");
          let value = await page.evaluate((el) => el.textContent, element);
          if (value.includes('НЕ ПОДТВЕРЖДЕНА')) {
            await browser.close()
            return {
              status: false
            }
          } else {
            await browser.close()
            return {
              status: true,
              sgn: value.split('Владелец :')[1].split('Издатель')[0]
            }
          }

        }).catch(async e => {
          await browser.close()
          if (count > 2) {
            console.log('на базе');
            return {
              error: 'Ошибка'
            }
          } else {
            console.log('пидор');
            uslugi(count + 1).then(val => {
              return val
            })
          }
        })



      });
    }
  }




}



const cryptoPro = async () => {
  let launchOptions = {
    headless: false,
    args: ["--start-maximized"]
  };

  const browser = await puppeteer.launch(launchOptions);

  const page = await browser.newPage();

  await page.setViewport({
    width: 1366,
    height: 768
  });
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
  );

  await page.goto("https://www.justsign.me/verifyqca/Verify/");
};

uslugi().then((val) => {
  console.log('val');
});