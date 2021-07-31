const express = require('express');
const queue = require('express-queue');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const { formdataNames, paths } = require('../../serverConfig');

const handlePost = require('../../controllers/check/handlePost');

const { upload } = require('./multer');

const router = require('express').Router();

const maxFiles = 50;

router.use(queue({ activeLimit: 1, queuedLimit: -1 }));

router.use(express.urlencoded({ extended: false }));

router.use(express.json());

router.use((req, res, next) => {
  const filepath = `${paths.uploads}${req.body.index}_${uuidv4()}/`;

  fs.mkdirSync(filepath, { recursive: true });

  req.customData = {
    filepath,
  };

  next();
});

router.use(upload.array(formdataNames.check, maxFiles));

router.post('/', handlePost);

module.exports = router;
