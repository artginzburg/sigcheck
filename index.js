const app = require('express')();
const cors = require('cors');

const { corsOptions, port } = require('./serverConfig.js');

const getSigns = require('./getSigns.js');

const devMode = process.env.NODE_ENV === 'development';
if (devMode) {
  getSigns().then(console.log);
  return;
}

app.use(cors(corsOptions));

app.get('/', async (req_, res) => {
  res.setHeader('Content-Type', 'application/json');

  try {
    const signs = await getSigns();
    res.send(signs);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Server error: ${error}`);
  }
});

app.listen(port, () => console.log(`API listening on http://localhost:${port} address!`));
