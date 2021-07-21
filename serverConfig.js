const serverConfig = {
  corsOptions: {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['X-Requested-With', 'content-type'],
    credentials: true,
  },
};

module.exports = serverConfig;
