const uslugi = require('./uslugi.js');
const cryptoPro = require('./cryptoPro.js');

const { runParser } = require('./utils.js');

runParser(cryptoPro).finally(process.exit);
