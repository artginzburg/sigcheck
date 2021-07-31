module.exports = function sortByExtension(files) {
  const filenames = {};

  files.forEach((file) => {
    const splitted = file.split('.');
    const extension = splitted[splitted.length - 1];

    if (['pdf', 'jpg', 'jpeg'].includes(extension)) {
      filenames.pdfOrJpg = file;
    } else {
      filenames.sig = file;
    }
  });

  return filenames;
};
