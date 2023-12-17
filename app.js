require("express-async-errors");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const cors = require("cors");

const config = require("./utils/config");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");

mongoose.set("strictQuery", false);

logger.info("connecting to ", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB", error.message);
  });
 
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
