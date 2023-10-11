
const app = require('./app/app');
require('dotenv').config();
const {sequelize} = require('./models')
const PORT = process.env.APP_PORT || 8081
async function db_main() {
    try {
        await sequelize.authenticate();
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
      await sequelize.query("CREATE SCHEMA IF NOT EXISTS public;");
      await sequelize.sync({alter:true});
}

app.listen(PORT,async()=>{
    console.log("App started on: " + PORT)
    //console.log(config);
    db_main();
  })