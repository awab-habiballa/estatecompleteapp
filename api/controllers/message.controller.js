import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import { errorHandler } from "../util/errorHandler.js";

export const addMessage = async (req, res, next) => {
  const userId = req.userId;
  const text = req.body.text;
  const chatId = req.params.chatId;

  try {
    const chat = await Chat.findOne({
      _id: chatId,
      userIds: { $in: [userId] },
    });
    if (!chat) return next(errorHandler(404, "Chat not found!"));

    const newMessage = new Message({
      text,
      userId,
      chatId,
    });

    await newMessage.save();

    chat.seenBy = [userId];
    chat.messages.push(newMessage._id);
    chat.lastMessage = text;
    await chat.save();

    res.status(200).json(newMessage);
  } catch (error) {
    next(errorHandler(500, "Failed to add message!"));
  }
};
