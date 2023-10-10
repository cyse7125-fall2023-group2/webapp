const express = require('express');
const app = express();

// Health check route
app.get('/healthz', (req, res) => {
  // Perform health checks here
  // Check database connection and downstream APIs
  
  // Assuming sequelize is your Sequelize instance
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
});

// Start the Express.js server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
