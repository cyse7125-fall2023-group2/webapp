import express from "express";
import * as healthController from "../controller/contr-health.js";


const healthRouter = express.Router();

// Middleware to check for request payload
const rejectPayload = (req, res, next) => {
  if (req.body && Object.keys(req.body).length > 0) {
    res.status(400).json();
  }
  else {
    // If there is no request body, proceed to the next middleware or route handler
    next();
  }
};

const bodyParse = (err,req,res,next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    // Handle invalid JSON request body
    res.status(400).json({ error: 'Invalid JSON in request body' });
  } else {
    next(); 
  }
}

healthRouter.use(rejectPayload);
healthRouter.use(bodyParse);

healthRouter.route('/')
  .all(healthController.handleHealthRequest);


export default healthRouter;