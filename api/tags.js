const express = require("express");
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require("../db");

tagsRouter.use((res, req, next) => {
  console.log("A request is being made to /tags");

  next();
});

tagsRouter.get("/", async (req, res) => {
  const tags = await getAllTags();

  res.send({
    tags,
  });
});

tagsRouter.get("/:tagName/posts", async (req, res, next) => {
  const { tagName } = req.params;

  try {
    const postsFromTagName = await getPostsByTagName(tagName);

    if (postsFromTagName) {
      res.send({
        posts: postsFromTagName,
      });
    } else {
      next({
        name: "GetPostFromTagNameError",
        message: "No posts with that tag exist",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = tagsRouter;
