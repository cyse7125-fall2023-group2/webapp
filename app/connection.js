
import mysql from 'mysql2'
// Create a connection to the MySQL database
const startConn = () => {
const connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    password: 'Jlabs@2021', 
    database: 'zone1db' 
  });
  
  // Connect to the database
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL database');
    
    // You can now execute MySQL queries here
  });

  return connection;
};




  export default startConn;