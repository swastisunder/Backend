const express = require("express");
const path = require("path");
const app = express();
const port = 8080;
const methodOverride = require("method-override");
const uuid = require("uuid").v4;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

let posts = [
  {
    id: uuid(),
    username: "ssb",
    content: "Hello World!",
  },
  {
    id: uuid(),
    username: "om",
    content: "Hello om!",
  },
];

app.get("/posts", (req, res) => {
  res.render("index.ejs", { posts });
});

app.post("/posts", (req, res) => {
  const { username, content } = req.body;
  posts.push({ id: uuid(), username, content });
  res.redirect("/posts");
});

app.get("/posts/new", (req, res) => {
  res.render("new.ejs");
});

app.listen(port, () => {
  console.log(`Server working well`);
});
