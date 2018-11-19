const hypernova = require('hypernova/server');
const path = require('path');
const railsRoot = require('../config/helpers/rails-root.js');
const winston = require('winston');

const production = process.env.NODE_ENV === 'production';
const statsPath = '../public/compiled/ssr/manifest.json';

hypernova({
  devMode: !production,

  getComponent(name) {
    const stats = require(statsPath); // eslint-disable-line global-require, import/no-dynamic-require
    if (!production) delete require.cache[require.resolve(statsPath)];

    const entryPath = path.join(
      path.join(railsRoot, 'public', 'compiled', 'ssr'),
      stats.assetsByChunkName[name].find(file => file.includes('.js')),
    );

    return require(entryPath).default; // eslint-disable-line global-require, import/no-dynamic-require
  },

  loggerInstance: winston.createLogger({
    transports: [
      production
        ? new winston.transports.File({ filename: 'log/hypernova.log' })
        : new winston.transports.Console(),
    ],
  }),

  port: 13337,
});
