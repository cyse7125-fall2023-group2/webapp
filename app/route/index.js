const express = require('express');
const route = express.Router();
const HealthController = require('../controller/healthcontroller');

route.get('/healthz',[HealthController.health])

module.exports = route;
