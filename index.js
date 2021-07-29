const cors = require('cors');
const time = require('express-timestamp');
const express = require('express');

const checkRouter = require('./routes/check');

const tests = require('./tests');
const { PORT, corsOptions, address } = require('./serverConfig');

// INITIALIZING APP

tests.removeLeftovers();

const app = express();

app.use(cors(corsOptions));

app.use(time.init);

app.use(checkRouter);

app.listen(PORT, () => {
  console.log(`API listening on ${address} address!`);

  tests.runTests();
});
