const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const fsExtra = require('fs-extra');
const axios = require('axios');
const FormData = require('form-data');

const { paths, routes, formdataNames, address } = require('./serverConfig');

const requestsQuantity = 10;
const requestsInterval = 4000;

function removeLeftovers() {
  if (fs.existsSync(paths.uploads)) {
    fsExtra.removeSync(paths.uploads);
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

const expectedTimeInSeconds = (requestsInterval / 1000) * requestsQuantity;
const expectedTime = Math.round(expectedTimeInSeconds);

function runTests() {
  // running test after the app is loaded
  console.log(
    `Expect all files to be sent in around ${'\x1b[91m'}${
      expectedTimeInSeconds < 60
        ? `${expectedTime} seconds`
        : `${Math.round(expectedTime / 60)} minutes`
    }${'\x1b[0m'}`
  );

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
