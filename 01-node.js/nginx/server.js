const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 8080;

const server = http.createServer((req, res) => {
  const filePath = path.join(
    __dirname,
    req.url === "/"
      ? "index.html"
      : path.extname(req.url) !== ".html"
      ? req.url + ".html"
      : req.url
  );

  const extName = String(path.extname(filePath)).toLowerCase();

  const mimeType = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
  };

  const contentType = mimeType[extName] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err === "ENOENT") {
        res.writeHead(404, { "Content-Type": contentType });
        res.end(`404: page not found brooo`);
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
