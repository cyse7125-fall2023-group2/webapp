const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const httpCheckRoutes = require("./api_routes/httpCheck");

//Database
const { sequelize } = require("./models");
const app = express();
const fs = require("fs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/healthz", async (req, res) => {
  res.setHeader("cache-control", "no-cache");
  if (req.method === "GET" && Object.keys(req.query).length > 0) {
    return res.status(400).send();
  }
  if (req.method === "GET" && Object.keys(req.body).length > 0) {
    return res.status(400).send();
  }

  sequelize
    .authenticate()
    .then(() => {
      // Database connection is successful
      res.status(200).end(); // HTTP 200 OK
    })
    .catch((err) => {
      // Database connection failed
      console.error("Database connection failed:", err);
      res.status(503).end(); // HTTP 503 Service Unavailable
    });
});

app.all("/healthz", async (req, res) => {
  res.setHeader("cache-control", "no-cache");
  res.status(405).send();
});

app.use('/v1/http-check',httpCheckRoutes);

const PORT = process.env.APP_PORT || 4000;
app.listen({ port: PORT }, async () => {});

module.exports = app;
