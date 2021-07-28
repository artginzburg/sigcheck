const { PORT = 6969 } = process.env;

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
  PORT,
};

module.exports = serverConfig;
