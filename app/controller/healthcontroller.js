

var healthController = {}
const sequelize = require('../model')

healthController.health = function(req,res){
    
    
    sequelize
    .authenticate()
    .then(() => {
      // Database connection is successful
      res.status(200).end(); // HTTP 200 OK
    })
    .catch((err) => {
      // Database connection failed
      console.error('Database connection failed:', err);
      res.status(503).end(); // HTTP 503 Service Unavailable
    });


  //  return res.status(200).json({message: "Healthz part 4"});
}

module.exports= healthController;