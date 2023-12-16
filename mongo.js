const mongoose = require("mongoose");

const url =
  "mongodb+srv://champsuvash:sDMk9v2vHH6CLMvW@test.st3xshd.mongodb.net/tests?retryWrites=true&w=majority";
mongoose.set("strictQuery", false);
mongoose.connect(url).then(console.log("connected to", url));

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
});

const Blog = mongoose.model("Blog", blogSchema);

const blog = new Blog({
  title: "Testing my tests again",
  author: "Suvash Joshi",
  url: "example.com",
});

blog.save().then((result) => {
  console.log("Blog saved", result);
  mongoose.connection.close();
});
