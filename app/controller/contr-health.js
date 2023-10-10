// import * as healthService from './../services/serv-health.js';
import { response } from 'express';

// import  * as dbConn from '../app.js';


import { dbConn } from '../app.js';

export const handleHealthRequest = async (request, response) => {
  response.setHeader('Cache-Control','no-cache')
  try {
    const method = request.method;
    
    // Handle different HTTP methods
    if (method === 'GET') {
      get(request,response); 
    } else {
      // Handle other methods
      // response.setHeader('Cache-Control', 'no-cache');
      response.status(405).json();
    }
  } catch (error) {
    setErrorResponse(error, response);
  }
};

export const get = async (request, response) => {
  try {
    dbConn.ping((err) => {
      if (err) {
        setErrorResponse(response, err);
      } else {
        setSuccessfulResponse(response,"success");
      }
    });
    // response.header('Cache-Control', 'no-cache');
  } catch (error) {
    setErrorResponse(response, error);
  }
}

const setSuccessfulResponse = (response,message) => {
  response.status(200);
  response.json()
  // response.json({
  //   connection: 'connected',
  //   message: message
  // });
}

const setErrorResponse = (response, err) => {
  response.header('Cache-Control', 'no-cache');
  response.status(503); // Use 503 for Service Unavailable
  response.json();
  // response.json({
  //   connection: 'disconnected',
  //   error: {
  //     message: "Service Unavailable",
  //   },
  // });
}
