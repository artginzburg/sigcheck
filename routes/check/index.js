const slowDown = require('express-slow-down');

const { formdataNames } = require('../../serverConfig');

const { upload } = require('./multer');
const handlePost = require('../../controllers/check/handlePost');

const router = require('express').Router();

const maxFiles = 50;

const speedLimiter = slowDown({
  windowMs: 6 * 1000,
  // delayAfter: 1, // default: allow 1 request per windowsMs milliseconds, then...
  delayMs: 6 * 1000, // begin adding delayMs milliseconds of delay per request above delayAfter requests:
  // maxDelayMs: 20 * 1000, // maximum delay is maxDelayMs milliseconds
});

router.use(speedLimiter);

router.use(upload.array(formdataNames.check, maxFiles));

router.post('/', handlePost);

module.exports = router;
