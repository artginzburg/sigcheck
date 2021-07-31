const express = require('express');
const queue = require('express-queue');
const { formdataNames } = require('../../serverConfig');

const { upload } = require('./multer');
const handlePost = require('../../controllers/check/handlePost');

const router = require('express').Router();

const maxFiles = 50;

router.use(queue({ activeLimit: 1, queuedLimit: -1 }));

router.use(express.urlencoded({ extended: false }));

router.use(express.json());

router.use(upload.array(formdataNames.check, maxFiles));

router.post('/', handlePost);

module.exports = router;
