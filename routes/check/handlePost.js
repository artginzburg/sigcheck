const fs = require('fs');
const fsExtra = require('fs-extra');

const { paths } = require('../../serverConfig');

const getSigns = require('./getSigns');

const handlePost = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const filepath = req.files[0].destination;

  try {
    const signs = await getSigns(filepath);
    res.send(signs);
    fsExtra.removeSync(filepath);

    try {
      fs.rmdirSync(paths.uploads);
    } catch (error) {
      if (error.code === 'ENOTEMPTY') console.log(`There is leftover trash in ${paths.uploads}`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Server error: ${error}`);
  }
};

module.exports = handlePost;
