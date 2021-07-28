const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const fsExtra = require('fs-extra');
const time = require('express-timestamp');
const axios = require('axios');
const FormData = require('form-data');

const getSigns = require('./getSigns.js');

const app = require('express')();

const PORT = 6969;

function makeFolderedPath(filepath) {
  return `./${filepath}/`;
}

const reqToHash = function (req) {
  // console.log(req.files);
  const contentLength = req.headers['content-length'];
  // console.log(req.headers);
  const timestamp = String(req.timestamp);

  // console.log(timestamp);

  // const file = req.files[0];

  // console.log(req.files);

  // const size = file.size;
  // const filename = file.filename;

  // const replacerFunc = () => {
  //   const visited = new WeakSet();
  //   return (key, value) => {
  //     if (typeof value === 'object' && value !== null) {
  //       if (visited.has(value)) {
  //         return;
  //       }
  //       visited.add(value);
  //     }
  //     return value;
  //   };
  // };

  const stringToHash = contentLength + timestamp;

  // fs.writeFile(`./test${uuidv4()}.json`, stringToHash, () => {});
  //  + size + filename;

  const hash = hashCode(stringToHash);

  const positive = Math.pow(hash, 2);

  return String(positive);
};

const hashCode = function (string) {
  var hash = 0,
    i,
    chr;
  if (string.length === 0) return hash;
  for (i = 0; i < string.length; i++) {
    chr = string.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    // console.log(file);
    // return;
    const filepath = reqToHash(req);

    fs.mkdirSync(filepath, { recursive: true });
    callback(null, makeFolderedPath(filepath));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

// const devMode = process.env.NODE_ENV === 'development';
// if (devMode) {
//   getSigns().then(console.log);
//   return;
// }

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['X-Requested-With', 'content-type'],
  credentials: true,
};

app.use(time.init);

app.use(cors(corsOptions));

app.post('/check', upload.array('toCheck', 2), async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const filepath = reqToHash(req);

  try {
    const signs = await getSigns(makeFolderedPath(filepath));
    res.send(signs);
    fsExtra.removeSync(filepath);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Server error: ${error}`);
  }
});

async function testFileSend(length) {
  // fs.readFile('./test.sig', {}, (err, data) => {
  //   console.log(data);
  // });

  const form = new FormData();

  const data = fs.createReadStream('./test.sig');

  form.append('toCheck', data);

  try {
    const response = await axios({
      method: 'post',
      url: 'http://localhost:6969/check',
      data: form,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
        // 'Content-Length': data.length,
      },
    });
  } catch (error) {
    const stringError = String(error);
    fs.writeFile(`./test${uuidv4()}.log`, stringError, () => {});
  }

  // console.log(response);
}

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT} address!`);

  let i = 0;
  var refreshId = setInterval(() => {
    if (i > 2) {
      clearInterval(refreshId);
      return;
    }
    i++;
    testFileSend();
  }, 500);
});
