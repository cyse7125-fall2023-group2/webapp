require("dotenv").config();
module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    schema: "app"
  },
  test: {
    username: "postgres",
    password: "1234",
    database: "advance_cloud",
    host: "localhost",
    dialect: "postgres",
    port: 5432,
  },
  production: {
    username: "postgres",
    password: "1234",
    database: "advance_cloud",
    host: "localhost",
    dialect: "postgres",
    port: 5432,
  },
};
