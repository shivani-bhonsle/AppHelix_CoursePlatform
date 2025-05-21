require("dotenv").config();
const { Pool } = require("pg");

const db = new Pool({
  host: process.env.DB_HOST,       // e.g. localhost or host.docker.internal
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

module.exports = db;