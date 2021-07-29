const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const FormData = require('form-data');
const rimraf = require('rimraf');

const { paths, routes, formdataNames, address } = require('./serverConfig');

function removeLeftovers() {
  if (fs.existsSync(paths.uploads)) {
    rimraf(paths.uploads, console.log);
  }
  const traineddatapath = './eng.traineddata';
  if (fs.existsSync(traineddatapath)) {
    fs.unlinkSync(traineddatapath);
  }
}

async function testFileSend() {
  const form = new FormData();

  const testFile = fs.createReadStream('./test.sig');
  const logDirectory = './logs/';

  form.append(formdataNames.check, testFile);

  try {
    // const response =
    await axios({
      method: 'post',
      url: `${address}${routes.check}`,
      data: form,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
      },
    });
  } catch (error) {
    const stringError = String(error);
    fs.mkdirSync(logDirectory, { recursive: true });
    fs.writeFileSync(`${logDirectory}test${uuidv4()}.log`, stringError);
  }
}

function runTests() {
  // running test after the app is loaded
  const requestsQuantity = 4;
  const requestsInterval = 3000;

  let i = 0;
  var refreshId = setInterval(() => {
    if (i >= requestsQuantity) {
      clearInterval(refreshId);
      return;
    }
    i++;
    testFileSend();
  }, requestsInterval);
}

module.exports = {
  removeLeftovers,
  runTests,
};
