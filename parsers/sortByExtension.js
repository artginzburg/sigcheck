const sigExt = 'sig';
const pdfExt = 'pdf';
const jpgExt = ['jpg', 'jpeg'];

module.exports = function sortByExtension(files) {
  const filenames = {};

  files.forEach((file) => {
    const splitted = file.split('.');
    const extension = splitted[splitted.length - 1];

    if ([pdfExt, ...jpgExt].includes(extension)) {
      filenames.pdfOrJpg = file;
    }
    if ([sigExt].includes(extension)) {
      filenames.sig = file;
    }
  });

  if (Object.keys(filenames).length === 0) {
    filenames.error =
      'Среди файлов не нашлось электронных подписей в формате .sig, .pdf, .jpg или .jpeg';
  }

  return filenames;
};
