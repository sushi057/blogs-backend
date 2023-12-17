const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "Testing my tests",
    author: "Suvash Joshi",
    url: "example.com",
  },
  {
    title: "Using supertest",
    author: "Fullstackopen",
    url: "example.com",
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "finding out whocares",
    author: "whocares",
    url: "whocares.com",
  });

  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
