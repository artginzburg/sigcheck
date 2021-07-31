const fs = require('fs');

function getFileNames(pathName) {
  return fs.readdirSync(pathName);
}

module.exports = {
  getFileNames,
};
