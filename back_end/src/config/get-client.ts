const { Pool } = require('pg');

// Create a single pool instance based on environment
const pool = process.env.PG_HOST === 'localhost' 
  ? new Pool({
      host: process.env.PG_HOST,
      port: process.env.PG_PORT,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
    })
  : new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      max: 20,
    });

// Export the function to get the existing pool instance
module.exports.getClient = () => {
  return pool;
};
