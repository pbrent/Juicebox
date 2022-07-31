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

const { PORT = 3000 } = process.env
server.listen(PORT, () => {
  console.log("The server is up on port", PORT);
});

server.get('/background/:color', (req, res, next) => {
  res.send(`
  <body style="background: ${ req.params.color };">
    <h1>Hello World</h1>
  </body>
  `);
});

server.get('/add/:first/to/:second', (req, res, next) => {
  res.send(`<h1>${ req.params.first } + ${ req.params.second } = ${
    Number(req.params.first) + Number(req.params.second)
   }</h1>`);
});
