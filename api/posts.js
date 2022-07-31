const express = require("express");
const { requireUser } = require("./utils");
const { getAllPosts, createPost, updatePost, getPostById } = require("../db");
const postsRouter = express.Router();

postsRouter.use((res, req, next) => {
  console.log("A request is being made to /posts");

  next();
});

postsRouter.post("/", requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;


  const authorId = req.user.id;

  const tagArr = tags.trim().split(/\s+/);

  const postData = { authorId, title, content, tagArr };


  // console.log("this is postData", postData);

  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
    const post = await createPost(postData);

    // console.log("this is post", post);

    if (post) {
      res.send({ post });
    } else {
      next({
        name: "PostError",
        message: "Cannot access posts for this user",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.patch("/:postId", requireUser, async (req, res, next) => {
  const { postId } = req.params;
  const { title, content, tags } = req.body;

  const updateFields = {};

  if (tags && tags.length > 0) {
    updateFields.tags = tags.trim().split(/\s+/);
  }

  if (title) {
    updateFields.title = title;
  }

  if (content) {
    updateFields.content = content;
  }

  try {
    const originalPost = await getPostById(postId);

    if (originalPost.author.id === req.user.id) {
      const updatedPost = await updatePost(postId, updateFields);
      res.send({ post: updatedPost });
    } else {
      next({
        name: "UnauthorizedUserError",
        message: "You cannot update a post that is not yours",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.delete('/:postId', requireUser, async (req, res, next) =>{
  try {
    const post = await getPostById(req.params.postId);

    if (post && post.author.id === req.user.id) {
      const updatedPost = await updatePost(post.id, { active: false });

      res.send ({ post: updatedPost});

    } else {
      next(post ? {
        name: "UnautorizedUserError",
        message: "You cannot delete a post that is not yours"
      } : {
        name: "PostNotFoundError",
        message: "That post does not exist"
      });
    }
  } catch ({ name, message }) {
    next ({ name, message })
  }
});



postsRouter.get('/', async (req, res, next) => {
  try {
    const allPosts = await getAllPosts();

    const posts = allPosts.filter(post => {
      return post.active || (req.user && post.author.id === req.user.id);
      
      // if (post.active) {
      //   return true;
      // }

      // if (req.user && post.author.id === req.user.id) {
      //   return true;
      // }

      // return false;

    });

    res.send({
      posts
    });
  } catch ({ name, message }) {
    next ({ name, message });
  }
});

module.exports = postsRouter;
