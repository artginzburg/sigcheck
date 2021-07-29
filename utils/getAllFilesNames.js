const fs = require('fs');

const resSuffix = 'sig';
const pdfExt = 'pdf';

module.exports = function getAllFilesNames(pathName) {
  let files = fs.readdirSync(pathName);

  const filtered = files.filter((file) => ![resSuffix, pdfExt].includes(file.split('.')[1])).length;

  return (
    (() => {
      if (!filtered) {
        if (files.length === 1) {
          return '';
        }
        if (files.length === 2) {
          return pdfExt;
        }
      }

      return 'to';
    })() + resSuffix
  );
};
