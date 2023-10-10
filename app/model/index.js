const { Sequelize } = require('sequelize');
require('dotenv').config();

const db_config = {
    DB_NAME:process.env.DB_NAME,
    DB_USERNAME:process.env.DB_USERNAME,
    DB_HOST:process.env.DB_HOST,
    DB_PORT:process.env.DB_PORT,
    DB_DIALECT:process.env.DB_DIALECT,
    DB_PASSWORD: process.env.DB_PASSWORD    
}



const sequelize = new Sequelize(db_config.DB_NAME, db_config.DB_USERNAME, db_config.DB_PASSWORD, {
  host: db_config.DB_HOST,
  port:db_config.DB_PORT,
  dialect: db_config.DB_DIALECT /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
});


module.exports = sequelize;