const cors = require('cors');

const app = require('express')();
const port = 6969;

const getSigns = require('./getSigns.js');

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['X-Requested-With', 'content-type'],
  credentials: true,
};

app.use(cors(corsOptions));

app.get('/', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  try {
    const signs = await getSigns();
    res.send(signs);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
