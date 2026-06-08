const express = require("express");

const eventRoutes = require(
  "./routes/eventRoutes"
);

const registrationRoutes = require(
  "./routes/registrationRoutes"
);

const app = express();

app.use(express.json());

app.use(
  "/api/events",
  eventRoutes
);

app.use(
  "/api/registrations",
  registrationRoutes
);

module.exports = app;