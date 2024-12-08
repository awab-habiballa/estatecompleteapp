import Post from "../models/post.model.js";
import PostDetail from "../models/postDetail.model.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

import { errorHandler } from "../util/errorHandler.js";
import SavedPost from "../models/savedPost.js";

export const getPosts = async (req, res, next) => {
  const query = req.query;
  const filters = {
    ...(query.city && { city: { $regex: query.city, $options: "i" } }),
    ...(query.type && { type: query.type }),
    ...(query.property && { property: query.property }),
    ...(query.bedroom && { bedroom: parseInt(query.bedroom) }),
    price: {
      $gte: parseInt(query.minPrice) || 0,
      $lte: parseInt(query.maxPrice) || 10000000,
    },
  };

  try {
    const posts = await Post.find(filters).populate(
      "user",
      "username email -_id"
    );
    res.status(200).json(posts);
  } catch (error) {
    next(errorHandler(500, "Failed to fetch posts!"));
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "username  avatar  -_id")
      .populate("postDetail");

    if (!post) {
      return next(errorHandler(404, "Post not found!"));
    }

    let userId;
    const token = req.cookies.token;

    if (!token) {
      userId = null;
    } else {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) {
          userId = null;
        } else {
          userId = payload.id;
        }
      });
    }
    const saved = await SavedPost.findOne({
      user: userId,
      post: req.params.id,
    });

    const postObject = post.toObject();
    res.status(200).json({ ...postObject, isSaved: saved ? true : false });
  } catch (error) {
    next(errorHandler(500, "Failed to fetch post!"));
  }
};

export const addPost = async (req, res, next) => {
  try {
    const userId = req.userId;

    const { postData, postDetail } = req.body;

    // Step 1: Create the Post document
    const newPost = new Post({
      ...postData,
      user: userId,
    });

    const savedPost = await newPost.save();

    // Step 2: Create the PostDetail document
    const newPostDetail = new PostDetail({
      ...postDetail,
      post: savedPost._id,
    });

    const savedPostDetail = await newPostDetail.save();

    // Step 3: Link the PostDetail to the Post
    savedPost.postDetail = savedPostDetail._id;
    await savedPost.save();

    // Step 4: Add the Post ID to the User's posts array
    await User.findByIdAndUpdate(userId, { $push: { posts: savedPost._id } });

    res.status(201).json(savedPost);
  } catch (error) {
    next(errorHandler(500, "Failed to add post!"));
  }
};

export const updatePost = async (req, res, next) => {
  try {
    console.log("it works");
  } catch (error) {
    next(errorHandler(500, "Failed to update post!"));
  }
};

export const deletePostPosts = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) return next(errorHandler(404, "Post not found!"));

    if (userId !== post.user.toString())
      return next(errorHandler(403, "Not Authorized!"));

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted!" });
  } catch (error) {
    next(errorHandler(500, "Failed to delete post!"));
  }
};
