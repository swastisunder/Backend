const express = require("express");
const app = express();
const port = 8080;

app.get("/", (req, res) => {
  res.send(`Home`);
});

app.get("/help", (req, res) => {
  res.send(`Help`);
});

app.get("/user/:name", (req, res) => {
  res.send(`Hello ${req.params.name}`);
});

app.get("/search", (req, res) => {
  let data = "";

  for (const key in req.query) {
    data += `${key}: ${req.query[key]} `;
  }

  res.send(data);
});

app.use((req, res) => {
  res.send(`404: Page not found Brooooooo`);
});

app.listen(port, () => {
  `App is listening on port ${port}`;
});
