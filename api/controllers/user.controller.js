import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../util/errorHandler.js";
import Post from "../models/post.model.js";
import SavedPost from "../models/savedPost.js";
import Chat from "../models/chat.model.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    next(errorHandler(500, "Failed to fetch users!"));
  }
};

export const getUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    next(errorHandler(500, "Failed to fetch user!"));
  }
};

export const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  if (id !== tokenUserId) return next(errorHandler(403, "Not Authorized"));

  if (req.body.password === "") {
    delete req.body.password;
  }

  if (req.body.password) {
    req.body.password = await bcryptjs.hash(req.body.password, 10);
  }
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json(user);
  } catch (err) {
    next(errorHandler(500, "Failed to update user!"));
  }
};

export const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  const tokenId = req.userId;

  if (id !== tokenId) return next(errorHandler(403, "Not Authorized"));

  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) return next(errorHandler(404, "User not found!"));

  res.status(200).json({ message: "User deleted successfully!" });
  try {
  } catch (err) {
    next(errorHandler(500, "Failed to delete user"));
  }
};

export const savePost = async (req, res, next) => {
  const postId = req.body.postId;
  const userId = req.userId;

  try {
    // Check if the post is already saved by this user
    const existingSavedPost = await SavedPost.findOne({
      user: userId,
      post: postId,
    });

    if (existingSavedPost) {
      // If exists, unsave the post (delete the SavedPost)
      await SavedPost.findByIdAndDelete(existingSavedPost._id);

      // Optionally update User and Post models to remove references
      await User.findByIdAndUpdate(userId, {
        $pull: { savedPosts: existingSavedPost._id },
      });
      await Post.findByIdAndUpdate(postId, {
        $pull: { savedPosts: existingSavedPost._id },
      });

      return res.status(200).json({ message: "Post unsaved successfully." });
    }

    // If not saved, save the post
    const newSavedPost = new SavedPost({ user: userId, post: postId });
    await newSavedPost.save();

    // Update User and Post models to include references
    await User.findByIdAndUpdate(userId, {
      $push: { savedPosts: newSavedPost._id },
    });
    await Post.findByIdAndUpdate(postId, {
      $push: { savedPosts: newSavedPost._id },
    });

    res
      .status(201)
      .json({ message: "Post saved successfully.", savedPost: newSavedPost });
  } catch (error) {
    next(errorHandler(500, "Failed to save post!"));
  }
};

export const profilePosts = async (req, res, next) => {
  const userId = req.userId;
  try {
    const userPosts = await Post.find({ user: userId });
    const saved = await SavedPost.find({ user: userId }).populate("post");

    const savedPosts = saved.map((item) => item.post);

    res.status(200).json({ userPosts, savedPosts });
  } catch (err) {
    next(errorHandler(500, "Failed to fetch profile posts!"));
  }
};

export const getNotificationNumber = async (req, res, next) => {
  const userId = req.userId;
  try {
    const chatsCount = await Chat.countDocuments({
      userIds: { $in: [userId] },
      seenBy: { $ne: userId },
    });

    res.status(200).json(chatsCount);
  } catch (error) {
    next(errorHandler(500, "Failed to fetch notification!"));
  }
};
