const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const fs = require('fs');
const fsExtra = require('fs-extra');

const { paths, routes, formdataNames } = require('../serverConfig');

const getSigns = require('../getSigns');

const router = require('express').Router();

const MAXIMUM_FILES = 50;

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

const storage = multer.diskStorage({
  destination: function (req_, file_, callback) {
    const filepath = `${paths.uploads}${uuidv4()}/`;

    fs.mkdirSync(filepath, { recursive: true });
    callback(null, filepath);
  },
  filename: function (req_, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage });

router.use(upload.array(formdataNames.check, MAXIMUM_FILES));

router.post(routes.check, postCheckAfterUploadCallback);

module.exports = router;
