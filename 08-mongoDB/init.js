const Chat = require("./models/chat.js");
const mongoose = require("mongoose");

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

let chats = [
  { from: "ssb", to: "nupur", msg: "omg", created_at: new Date() },
  { from: "nupur", to: "ssb", msg: "what happened?", created_at: new Date() },
  { from: "ganesh", to: "om", msg: "are you coming?", created_at: new Date() },
  { from: "om", to: "ganesh", msg: "5 min", created_at: new Date() },
  { from: "badal", to: "harsh", msg: "call me asap", created_at: new Date() },
  { from: "harsh", to: "badal", msg: "in meeting rn", created_at: new Date() },
  { from: "ssb", to: "om", msg: "movie tonight?", created_at: new Date() },
  { from: "om", to: "ssb", msg: "sure bro", created_at: new Date() },
  {
    from: "nupur",
    to: "ganesh",
    msg: "class tomorrow?",
    created_at: new Date(),
  },
  { from: "ganesh", to: "nupur", msg: "yes 9am", created_at: new Date() },
];

Chat.insertMany(chats)
  .then((res) => {
    console.log("Chats inserted:", res);
  })
  .catch((err) => {
    console.log(err);
  });
