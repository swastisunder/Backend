const express = require("express");
const path = require("path");
const app = express();
const port = 8080;

const users = [
  {
    username: "om",
    bio: "Building the future with code 💻",
    followers: 1200,
    following: 180,
    posts: [{}, {}, {}],
  },
  {
    username: "swasti",
    bio: "Producer • Beat maker 🎧",
    followers: 950,
    following: 210,
    posts: [{}, {}, {}, {}],
  },
  {
    username: "nupur",
    bio: "Finding new roads ✈️🌍",
    followers: 3400,
    following: 320,
    posts: [{}, {}, {}, {}, {}],
  },
  {
    username: "ganesh",
    bio: "Taste. Shoot. Repeat 🍕📸",
    followers: 2700,
    following: 150,
    posts: [{}, {}, {}, {}],
  },
  {
    username: "badal",
    bio: "UI / UX Designer 🎨",
    followers: 1800,
    following: 140,
    posts: [{}, {}],
  },
  {
    username: "jeni",
    bio: "No excuses. Just results 💪",
    followers: 5200,
    following: 260,
    posts: [{}, {}, {}, {}, {}, {}],
  },
  {
    username: "krish",
    bio: "Words that heal the soul ✨",
    followers: 8000,
    following: 90,
    posts: [{}, {}, {}],
  },
  {
    username: "harsh",
    bio: "Living in the ML matrix 🤖",
    followers: 4300,
    following: 200,
    posts: [{}, {}, {}],
  },
  {
    username: "lekhu",
    bio: "Esports and chill 🎮🔥",
    followers: 6200,
    following: 310,
    posts: [{}, {}, {}, {}, {}],
  },
  {
    username: "rajesh",
    bio: "Less is more 🧘",
    followers: 1900,
    following: 120,
    posts: [{}],
  },
];

app.set("view-engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.get("/rolldice", (req, res) => {
  let diceVal = Math.floor(Math.random() * 6) + 1;
  res.render("rollDice.ejs", {});
});

app.get("/users/:username", (req, res) => {
  const username = req.params.username.toLowerCase();
  const user = users.find((u) => u.username.toLowerCase() === username);

  if (!user) {
    res.send(`404: not found page of ${username}`);
  }

  res.render("insta.ejs", { user });
});

app.use((req, res) => {
  res.send(`404: Page not found broooooooo`);
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
