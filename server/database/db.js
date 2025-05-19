const { Client } = require("pg");

const db = new Client({
  user: "postgres",
  host: "host.docker.internal",
  database: "apphelix_db",
  password: "root",
  port: 5433,
});

module.exports = db;
