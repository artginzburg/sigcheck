const uslugi = require('./uslugi.js');
const cryptoPro = require('./cryptoPro.js');

const runParser = require('./utils/runParser.js');

runParser(uslugi).finally(process.exit);
