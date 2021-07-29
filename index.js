const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const fsExtra = require('fs-extra');
const time = require('express-timestamp');
const axios = require('axios');
const FormData = require('form-data');
const rimraf = require('rimraf');
const express = require('express');

const getSigns = require('./getSigns.js');
const { PORT, paths, routes, ...serverConfig } = require('./serverConfig.js');

const hostForLog = process.env.HOST ?? 'localhost';

const address = `http://${hostForLog}:${PORT}`;

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

  form.append('toCheck', testFile);

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

function makeFolderedPath() {
  return `${paths.uploads}${uuidv4()}/`;
}

var storage = multer.diskStorage({
  destination: function (req_, file_, callback) {
    const filepath = makeFolderedPath();

    fs.mkdirSync(filepath, { recursive: true });
    callback(null, filepath);
  },
  filename: function (req_, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

const postCheckAfterUploadCallback = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const filepath = req.files[0].destination;

  try {
    const signs = await getSigns(filepath);
    res.send(signs);
    fsExtra.removeSync(filepath);

    try {
      fs.rmdirSync(paths.uploads);
    } catch (error) {
      if (error.code === 'ENOTEMPTY') console.log(`There is leftover trash in ${paths.uploads}`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Server error: ${error}`);
  }
};

// INITIALIZING APP

removeLeftovers();

const app = express();

app.use(cors(serverConfig.corsOptions));

app.use(time.init);

app.post(routes.check, upload.array('toCheck', 2), postCheckAfterUploadCallback);

app.listen(PORT, () => {
  console.log(`API listening on ${address} address!`);

  runTests();
});
