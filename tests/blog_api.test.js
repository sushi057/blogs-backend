const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("../tests/test_helper");

mongoose.set("bufferTimeoutMS", 30000);

const api = supertest(app);

jest.setTimeout(30000);

//Load the database with precooked data
beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

describe("When there are blogs in saved", () => {
  //Test returned blogs are in json format
  test("Blogs are in json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 10000);

  //Test number of blogs in database
  test("All blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    console.log(response.body);

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  }, 10000);

  //Check if a blog exists
  test("A blog in the database is", async () => {
    const response = await api.get("/api/blogs");

    const titles = response.body.map((r) => r.title);
    expect(titles).toContain("Testing my tests");
  });
});

describe("Viewing a specifi blog", () => {
  //Test if a blog can be viewed
  test("succeeds with a valid id", async () => {
    const blogsAtStart = await helper.blogsInDb();

    const blogToView = blogsAtStart[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(resultBlog.body).toEqual(blogToView);
  });

  //Test for a non existing blog
  test("fails with statuscode 404 if blog doesnt exist", async () => {
    const nonExistingId = await helper.nonExistingId();

    await api.get(`/api/blogs/${nonExistingId}`).expect(404);
  });

  test("fails with statuscode 400 if id is invalid", async () => {
    const invalidId = "5a3d5da59070081a82a3445";

    await api.get(`/api/blogs/${invalidId}`).expect(400);
  });
});

describe("Addition of a new blog", () => {
  //Test if a blog can be added to database
  test("succeeds for a valid blog", async () => {
    const newBlog = {
      title: "How to use async/await",
      author: "fullstackopen",
      url: "exmple.com",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).toContain("How to use async/await");
  });

  //Test if a blog without title isnt saved to database
  test("fails for a blog without title", async () => {
    const newBlog = {
      author: "nobody cares",
      url: "cats.com",
    };

    await api.post("/api/blogs").send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe("Deletion of a blog", () => {
  //Test if a blog can be removed
  test("succeeds with code 204", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToView = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToView.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).not.toContain(blogToView.title);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
