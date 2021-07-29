const { PORT = 6969 } = process.env;

const hostForLog = process.env.HOST ?? 'localhost';

const serverConfig = {
  corsOptions: {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['X-Requested-With', 'content-type'],
    credentials: true,
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
