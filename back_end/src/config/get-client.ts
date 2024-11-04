const { Client } = require('pg');
require('dotenv').config();

module.exports.getClient = async () => {
  var client
  var client
  if (process.env.PG_HOST === 'localhost') {
    client = new Client({
      host: process.env.PG_HOST,
      port: process.env.PG_PORT,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
    })
  } else {
    client = new Client({
      connectionString: process.env.DATABASE_URL + '?sslmode=require'
    });
  }

  await client.connect();
  return client;
};