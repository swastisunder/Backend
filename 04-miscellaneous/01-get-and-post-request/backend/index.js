const express = require("express");
const port = 8080;
const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/reg", (req, res) => {
  const { name, pass } = req.query;
  res.send(`GET request received. Name: ${name}, Pass: ${pass}`);
});

app.post("/reg", (req, res) => {
  const { name, pass } = req.body;
  res.send(`POST request received. Name: ${name}, Pass: ${pass}`);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
