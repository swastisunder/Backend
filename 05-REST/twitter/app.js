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

app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  posts = posts.filter((p) => p.id !== id);
  res.redirect("/posts");
});

app.get("/posts", (req, res) => {
  res.render("index.ejs", { posts });
});

app.get("/posts/new", (req, res) => {
  res.render("new.ejs");
});

app.get("/posts/:id", (req, res) => {
  const { id } = req.params;
  const post = posts.find((p) => p.id === id);
  if (post) {
    res.render("show.ejs", { post });
  } else {
    res.render("error.ejs", { error: "Post not found" });
  }
});

app.post("/posts", (req, res) => {
  const { username, content } = req.body;
  posts.push({ id: uuid(), username, content });
  res.redirect("/posts");
});

app.get("/posts/:id/edit", (req, res) => {
  const { id } = req.params;
  let post = posts.find((p) => p.id === id);
  if (post) {
    res.render("edit.ejs", { post });
  } else {
    res.render("error.ejs", { error: "Post not found" });
  }
});

app.patch("/posts/:id", (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  let post = posts.find((p) => p.id === id);
  if (post) {
    post.content = content;
    res.redirect("/posts");
  } else {
    res.render("error.ejs", { error: "lala" });
  }
});

app.listen(port, () => {
  console.log(`Server working well`);
});
