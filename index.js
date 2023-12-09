// Imports
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Blog = require("./models/blog");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

//Get homepage
app.get("/", (request, response) => {
  response.send("<h1>Hello. This is the homepage</h1>");
});

//Get all blogs
app.get("/api/blogs", (request, response) => {
  Blog.find().then((blogs) => {
    response.json(blogs);
  });
});

//Get specific blog
app.get("/api/blogs/:id", (request, response, next) => {
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

//Add new blog
app.post("/api/blogs", (request, response) => {
  const body = request.body;

  //check for missing contents
  if (!body.title) {
    return response.status(400).json({
      error: "title missing",
    });
  } else if (!body.url) {
    return response.status(400).json({
      error: "url missing",
    });
  }

  //add the newly given blog
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    upvotes: body.upvotes,
  });

  blog.save().then((savedBlog) => {
    response.json(savedBlog);
  });
});

//Update a blog
app.put("/api/blogs/:id", (request, response, next) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    upvotes: body.upvotes,
  };

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then((updatedBlog) => {
      response.json(updatedBlog);
    })
    .catch((error) => next(error));
});

//Get info page
app.get("/info", (request, response) => {
  response.send(`<h2>Phonebook has info for ${Blog.length} people</h2>`);
});

//Log the blog info
const requestLogger = (request, response, next) => {
  console.log("Method", request.method);
  console.log("Path:", request.path);
  console.log("Body:", request.body);
  console.log("------");
  next();
};

//Handle unkown endpoint error
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

app.use(requestLogger);
app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server running on 3001");
});
