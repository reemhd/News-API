const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.DATABASE_HOST) {
  throw new Error("DATABASE_HOST not set");
}

const config = {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT ?? 5432,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  max: 2,
};

module.exports = new Pool(config);
