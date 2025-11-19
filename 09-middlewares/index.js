const express = require("express");
const port = 8080;
const app = express();

app.use("/api", (req, res, next) => {
  let { token } = req.query;
  if (token === "ssb") {
    next();
  } else {
    res.send("bye");
  }
});

app.get("/api", (req, res) => {
  res.send("data");
});

app.get("/", (req, res) => {
  res.send(`HOME`);
});

app.get("/random", (req, res) => {
  res.send(`Random`);
});

app.listen(port, () => {
  console.log(`Serer is running`);
});
