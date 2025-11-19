const express = require("express");
const port = 8080;
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

main()
  .then(() => {
    console.log(`DB Connected`);
  })
  .catch((err) => {
    console.log(err);
  });

// let chat1 = new Chat({
//   from: "SSB",
//   to: "nupur",
//   msg: "omg",
//   created_at: new Date(),
// });

// chat1
//   .save()
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

app.get("/chats", async (req, res) => {
  await Chat.find()
    .then((chats) => {
      res.render("chats.ejs", { chats: chats });
    })
    .catch((err) => {
      console.log(err);
      res.send("Error retrieving chats");
    });
});

app.get("/chats/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/chats", async (req, res) => {
  let { from, to, msg } = req.body;
  let chat = new Chat({ from, to, msg, created_at: new Date() });
  await chat
    .save()
    .then(() => {
      res.redirect("/chats");
    })
    .catch((err) => {
      console.log(err);
      res.send("Error saving chat");
    });
});

app.delete("/chats/:id", async (req, res) => {
  await Chat.findByIdAndDelete(req.params.id);
  res.redirect("/chats");
});

app.get("/chats/:id/edit", async (req, res) => {
  let chat = await Chat.findById(req.params.id);
  res.render("edit.ejs", { chat: chat });
});

app.put("/chats/:id", async (req, res) => {
  let { msg } = req.body;
  await Chat.findByIdAndUpdate(req.params.id, { msg }, { runValidators: true })
    .then(() => {
      res.redirect("/chats");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/", (req, res) => {
  res.send(`HOME`);
});

app.listen(port, () => {
  console.log(`App is listening`);
});
