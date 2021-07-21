const fs = require('fs');

const { testFolder } = require('../config.js');

const getAllFilesNames = () => {
  let files = fs.readdirSync(testFolder);
  if (
    files.length == 1 &&
    !(files.filter((file) => !['sig', 'pdf'].includes(file.split('.')[1])).length > 0)
  ) {
    return 'sig';
  } else if (
    files.length == 2 &&
    !(files.filter((file) => !['sig', 'pdf'].includes(file.split('.')[1])).length > 0)
  ) {
    return 'pdfsig';
  } else {
    return 'tosig';
  }
};

module.exports = getAllFilesNames;
