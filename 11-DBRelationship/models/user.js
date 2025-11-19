const mongoose = require("mongoose");
const { Schema } = require("mongoose");

main()
  .then(() => {
    console.log("DB Connect");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/relation");
}

const userSchema = new Schema({
  username: String,
  addresses: [{ _id: false, location: String, city: String }],
});

const User = mongoose.model("User", userSchema);

const addUsers = async () => {
  let user1 = new User({
    username: "SSB",
    addresses: [
      { location: "a", city: "Surat" },
      { location: "b", city: "Adajan" },
      { location: "c", city: "Jolva" },
    ],
  });

  let result = await user1.save();
  console.log(result);
};

addUsers();
