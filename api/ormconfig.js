const path = require('path');
/**
 * @type {import('typeorm').ConnectionOptions}
 */
module.exports = {
  type: 'postgres',
  database: process.env.PGRES_DB,
  username: process.env.PGRES_USER,
  password: process.env.PGRES_PASS,
  host: process.env.PGRES_HOST,
  // database: path.join(__dirname, './db.sqlite'),
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
