const path = require('path');
/**
 * @type {import('typeorm').ConnectionOptions}
 */
module.exports = {
  type: 'better-sqlite3',
  database: path.join(__dirname, './db.sqlite'),
  logging: true,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/subscriber',
  },
};