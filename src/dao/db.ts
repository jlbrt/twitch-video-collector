import knex from 'knex';
import { env } from '../env';

export const dbConnection = knex({
  client: 'pg',
  connection: {
    host: env.dbHost,
    port: env.dbPort,
    user: env.dbUser,
    password: env.dbPassword,
    database: env.dbName,
  },
});
