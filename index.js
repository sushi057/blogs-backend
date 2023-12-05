const express = require("express");
const app = express();

app.use(express.json());

let blogPosts = [
  {
    id: 1,
    title: "The Art of Web Development",
    author: "John Doe",
    url: "https://example.com/web-development-art",
    upvotes: 45,
  },
  {
    id: 2,
    title: "Exploring Artificial Intelligence",
    author: "Jane Smith",
    url: "https://example.com/exploring-ai",
    upvotes: 72,
  },
  {
    id: 3,
    title: "The Rise of Remote Work",
    author: "Alex Johnson",
    url: "https://example.com/rise-of-remote-work",
    upvotes: 34,
  },
  // Add more blog entries as needed
];

app.get("/", (request, response) => {
  response.send("<h1>Hello request</h1>");
});

app.get("/api/blogs", (request, response) => {
  response.json(blogPosts);
});

app.get("/api/blogs/:id", (request, response) => {
  const blog = blogPosts.find((blog) => blog.id === Number(request.params.id));

  console.log(blog);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/blogs/:id", (request, response) => {
  blogPosts = blogPosts.filter((blog) => blog.id !== Number(request.params.id));

  response.status(204).end();
});

app.post("/api/blogs", (request, response) => {
  const maxId =
    blogPosts.length > 0 ? Math.max(...blogPosts.map((n) => n.id)) : 0;

  const blog = request.body;
  blog.id = maxId + 1;

  blogPosts = blogPosts.concat(blog);
  response.json(blog);
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log("Server running on 3001");
});
