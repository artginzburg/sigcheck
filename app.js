const cors = require('cors');

const { corsOptions, routes } = require('./serverConfig');

const checkRouter = require('./routes/check');

const app = require('express')();

app.use(cors(corsOptions));

app.use(routes.check, checkRouter);

module.exports = app;
