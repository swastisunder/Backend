const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 8080;

const server = http.createServer((req, res) => {
  // Normalize URL and map to files inside the project directory.
  // If the request is for '/', serve index.html.
  // If the request has no extension, assume '.html'. Otherwise serve the path as-is.
  let reqPath = req.url || "/";
  if (reqPath === "/") reqPath = "index.html";
  else {
    // remove leading slash
    if (reqPath.startsWith("/")) reqPath = reqPath.slice(1);
    // if there's no extension, assume .html
    if (!path.extname(reqPath)) reqPath = reqPath + ".html";
  }

  const filePath = path.join(__dirname, reqPath);
  const extName = String(path.extname(filePath)).toLowerCase();

  const mimeType = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
  };

  const contentType = mimeType[extName] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("404: File not found brooooo");
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

server.listen(port, () => {
  console.log(`Server is listening on ${port} port`);
});
