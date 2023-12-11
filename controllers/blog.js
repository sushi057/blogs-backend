const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogRouter.get("/:id", (request, response, next) => {
  Blog.findById(request.params.id)
    .then((blog) => {
      if (blog) {
        response.json(blog);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

blogRouter.post("/", (request, response) => {
  const body = request.body;

  if (!body.title) {
    return response.status(400).json({
      error: "Title missing",
    });
  } else if (!body.url) {
    return response.status(400).send({
      error: "Url missing",
    });
  }

  const blog = new Blog({
    title: body.title,
    url: body.url,
    author: body.url,
    upvotes: body.upvotes,
  });

  blog.save().then((savedBlog) => {
    response.json(savedBlog);
  });
});

blogRouter.put("/:id", (request, response, next) => {
  const body = request.body;

  const blog = {
    title: body.title,
    url: body.url,
    author: body.author,
    upvotes: body.upvotes,
  };

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then((updatedBlog) => {
      response.json(updatedBlog);
    })
    .catch((error) => next(error));
});

module.exports = blogRouter;
