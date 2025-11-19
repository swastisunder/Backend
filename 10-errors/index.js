const express = require("express");
const port = 8080;
const app = express();
const ExpressError = require("./ExpressError");

app.use("/api", (req, res, next) => {
  let { token } = req.query;
  if (token === "ssb") {
    next();
  } else {
    throw new ExpressError(401, "Not allowed");
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

app.get("/err", (req, res) => {
  lala = lala;
});

app.get("/admin", (req, res) => {
  throw new ExpressError(403, "Not Admin");
});

app.use((err, req, res, next) => {
  let { status = 5000, message = "Some Error" } = err;
  res.status(status).send(message);
});

app.listen(port, () => {
  console.log(`Serer is running`);
});
