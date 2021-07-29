const cors = require('cors');

const { corsOptions } = require('./serverConfig');

const checkRouter = require('./routes/check');

const app = require('express')();

app.use(cors(corsOptions));

app.use(checkRouter);

module.exports = app;
