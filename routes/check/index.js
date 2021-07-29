const slowDown = require('express-slow-down');

const { routes, formdataNames } = require('../../serverConfig');

const { upload } = require('./multer');
const handlePost = require('./handlePost');

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

router.post(routes.check, handlePost);

module.exports = router;
