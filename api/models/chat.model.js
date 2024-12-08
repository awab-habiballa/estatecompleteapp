import mongoose from "mongoose";

const { Schema } = mongoose;

const chatSchema = new Schema(
  {
    userIds: [
      {
        type: String,
      },
    ],
    seenBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    lastMessage: {
      type: String,

      default: null,
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
