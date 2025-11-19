const mongoose = require("mongoose");
const { Schema } = require("mongoose");

main()
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/relation");
}

const userSchema = new Schema({
  name: String,
});

const User = mongoose.model("User", userSchema);

const addUser = async () => {
  let user1 = new User({ name: "SSB" });
  let user2 = new User({ name: "OM" });
  let res1 = await user1.save();
  let res2 = await user2.save();
  console.log(res1);
  console.log(res2);
};

// addUser();

const postSchema = new Schema({
  title: String,
  likes: Number,
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

const Post = mongoose.model("Post", postSchema);

const addPost = async () => {
  let users = await User.find({});

  if (users.length === 0) {
    console.error("No users found. Please uncomment and run addUser() first.");
    return;
  }

  let post1 = new Post({
    title: "s1",
    likes: 50,
    user: users[0],
  });

  let post2 = new Post({
    title: "o1",
    likes: 10,
    user: users[1],
  });

  let res = await post2.save();
  console.log(res);
};

// addPost();

const findPost = async () => {
  let data = await Post.find({}).populate("user");
  console.log(data);
};

findPost();
