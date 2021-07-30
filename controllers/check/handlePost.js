const fsExtra = require('fs-extra');

const getSigns = require('../../utils/getSigns');

const handlePost = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  console.log(req.body)
  const filepath = req.files[0].destination;

  try {
    const signs = await getSigns(filepath, req.body.index);
    // console.log('Sent status (among other info):', signs.status);
    res.send(signs);
    fsExtra.removeSync(filepath);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Server error: ${error}`);
  }
};

module.exports = handlePost;
