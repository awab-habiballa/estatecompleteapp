import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import { errorHandler } from "../util/errorHandler.js";

export const getChats = async (req, res, next) => {
  const userId = req.userId;
  try {
    const chats = await Chat.find({ userIds: { $in: [userId] } });

    for (const chat of chats) {
      const receiverId = chat.userIds.find(
        (id) => id.toString() !== userId.toString()
      );
      const receiver = await User.findById(receiverId).select(
        "_id username avatar"
      );
      chat._doc.receiver = receiver;
    }
    res.status(200).json(chats);
  } catch (error) {
    next(errorHandler(500, "Failed to fetch chats!"));
  }
};

export const getChat = async (req, res, next) => {
  const chatId = req.params.id;
  const userId = req.userId;

  try {
    const chat = await Chat.findOne({
      _id: chatId,
      userIds: { $in: [userId] },
    }).populate({
      path: "messages",
      options: { sort: { createdAt: 1 } },
    });

    if (!chat.seenBy.includes(userId)) {
      chat.seenBy.push(userId);
      await chat.save();
    }
    res.status(200).json(chat);
  } catch (error) {
    next(errorHandler(500, "Failed to fetch chat!"));
  }
};

export const addChat = async (req, res, next) => {
  const userId = req.userId;
  const receiverId = req.body.receiverId;
  try {
    const newChat = new Chat({
      userIds: [userId, receiverId],
    });
    await newChat.save();
    res.status(200).json(newChat);
  } catch (error) {
    next(errorHandler(500, "Failed to add chat!"));
  }
};

export const readChat = async (req, res, next) => {
  const userId = req.userId;
  const cahtId = req.params.id;
  try {
    const updatedChat = await Chat.findOneAndUpdate(
      {
        _id: cahtId,
        userIds: { $in: [userId] },
      },
      {
        $addToSet: { seenBy: userId },
      },
      { new: true }
    );

    res.status(200).json(updatedChat);
  } catch (error) {
    next(errorHandler(500, "Failed to read chat!"));
  }
};
