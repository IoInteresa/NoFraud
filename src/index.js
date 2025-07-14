const express = require("express");
const cors = require("cors");

const environment = require("./environments");
const routes = require("./Routes");
const { ErrorMiddleware, LogMiddleware } = require("./Middlewares");
const { startBot } = require("./Bot");

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// priority middleware
app.use(LogMiddleware);

app.use("", routes);
app.use(ErrorMiddleware);

startBot();

app.listen(environment.SERVER_PORT, () =>
  console.log(`Server listening on ${environment.SERVER_PORT}`)
);
