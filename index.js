const app = require('express')();
const cors = require('cors');

const { corsOptions } = require('./serverConfig.js');

const { PORT = 6969, NODE_ENV = 'production' } = process.env;

const getSigns = require('./getSigns.js');

const developmentMode = NODE_ENV === 'development';
if (developmentMode) {
  return getSigns().then(console.log);
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

app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT} address!`));
