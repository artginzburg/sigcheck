'use strict';
const app = require('./app');
const { PORT, address } = require('./serverConfig');

const devMode = process.env.NODE_ENV === 'development';
const tests = devMode ? require('./tests') : undefined;

devMode && tests.removeLeftovers();

const server = app.listen(PORT, () => {
  const listeningMessage = [
    devMode && '\x1b[36m',
    `API listening on ${address} address!`,
    devMode && '\x1b[0m',
  ];
  console.log(listeningMessage.filter(Boolean).join(' '));

  devMode && tests.runTests();
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated');
  });
});
