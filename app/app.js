const express = require('express');

// import startConn from "./connection.js";
// import bodyParser from 'body-parser';

// import { models } from "/models/index.js";
// import cors from 'cors';
// import route from "./route/index.js";




var route = require('./route');


const app =  express()
app.use(express.json());
//  app.use(cors());
 app.use(express.static(__dirname +'/public'));

app.use('/',route);

module.exports = app;