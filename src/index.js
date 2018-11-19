const hypernova = require('hypernova/server');
const path = require('path');
const winston = require('winston');

const production = process.env.NODE_ENV === 'production';

const defaultOptions = {
  'assets-path': process.cwd(),
  'logs-path': path.join(process.cwd(), 'hypernova.log'),
  'manifest-path': path.join(process.cwd(), 'manifest.json'),
  port: 13337,
};

const options = process.argv
  .slice(2)
  .reduce((options, arg) => {
    if (arg.indexOf('=')) {
      const [key, value] = arg.split('=');
      options[key.slice(2)] = value;
    }

    return options;
  }, defaultOptions);

hypernova({
  devMode: !production,

  getComponent(name) {
    const stats = require(options['manifest-path']);
    if (!production) delete require.cache[require.resolve(statsPath)];

    const entryPath = path.join(
      options['assets-path'],
      stats.assetsByChunkName[name].find(file => file.includes('.js')),
    );

    return require(entryPath).default;
  },

  loggerInstance: winston.createLogger({
    transports: [
      production
        ? new winston.transports.File({ filename: options['logs-path'] })
        : new winston.transports.Console(),
    ],
  }),

  port: options.port,
});
