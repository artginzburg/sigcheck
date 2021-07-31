const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file_, callback) {
    callback(null, req.customData.filepath);
  },
  filename: function (req_, file, callback) {
    callback(null, file.originalname);
  },
});

module.exports = {
  upload: multer({ storage }),
};
