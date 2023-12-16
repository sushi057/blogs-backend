const Blog = require("../models/blog");

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

const nonExistingTitle = async () => {
  const blog = new Blog({
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

module.exports = {
  initialBlogs,
  nonExistingTitle,
  blogsInDb,
};
