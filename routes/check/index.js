const { routes, formdataNames } = require('../../serverConfig');

const { upload } = require('./multer');
const handlePost = require('./handlePost');

const router = require('express').Router();

const maxFiles = 50;

router.use(upload.array(formdataNames.check, maxFiles));

router.post(routes.check, handlePost);

module.exports = router;
