require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const server = express();
server.use(morgan("dev"));
server.use(express.json());
const apiRouter = require("./api");
server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  
  console.log("<____Body Logger END____>");

  next();
});

const { client } = require("./db");
client.connect();

server.use("/api", apiRouter);

const PORT = 3000;
server.listen(PORT, () => {
  console.log("The server is up on port", PORT);
});


