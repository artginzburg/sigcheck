const app = require('./app');
const { PORT, address } = require('./serverConfig');

const tests = require('./tests');
const devMode = process.env.NODE_ENV === 'development';

devMode && tests.removeLeftovers();

app.listen(PORT, () => {
  console.log(`API listening on ${address} address!`);

  devMode && tests.runTests();
});
