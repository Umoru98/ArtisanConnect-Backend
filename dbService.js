import knex from 'knex';
import config from './knexfile.mjs';

const db = knex(config.development);

export default db;