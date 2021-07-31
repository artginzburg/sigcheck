const fs = require('fs');

const resSuffix = 'sig';
const pdfExt = 'pdf';
const jpgExt = ['jpg', 'jpeg'];

function getFileNames(pathName) {
  return fs.readdirSync(pathName);
}

function filesArePdfOrJpgSig(files) {
  const filtered = files.filter((file) =>
    [resSuffix, pdfExt, ...jpgExt].includes(file.split('.')[1])
  ).length;

  return (
    (() => {
      if (filtered) {
        if (files.length === 1) {
          return '';
        }
        if (files.length === 2) {
          return pdfExt;
        }
      }

      return 'to';
    })() +
      resSuffix ===
    'pdfsig'
  );
}

module.exports = {
  getFileNames,
  filesArePdfOrJpgSig,
};
