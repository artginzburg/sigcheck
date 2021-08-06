const { PORT = 6969 } = process.env;

const hostForLog = process.env.HOST ?? 'localhost';

const serverConfig = {
  corsOptions: {
    origin: '*',
    methods: ['POST'],
    allowedHeaders: ['X-Requested-With', 'Content-Type'],
  },
  paths: {
    uploads: './uploads/',
  },
  formdataNames: {
    check: 'toCheck',
  },
  routes: {
    check: '/check',
  },
  PORT,
  address: `http://${hostForLog}:${PORT}`,
};

module.exports = serverConfig;
