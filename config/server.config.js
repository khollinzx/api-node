const config = {
    port: process.env.APP_PORT || 4000,
    url: process.env.APP_URL || 'http://127.0.0.1',
    enviroment: process.env.APP_ENV || 'local',
};

module.exports = config;