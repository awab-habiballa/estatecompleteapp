import mongoose from "mongoose";

const savedPostSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the User model
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

savedPostSchema.index({ user: 1, post: 1 }, { unique: true });
const SavedPost = mongoose.model("SavedPost", savedPostSchema);
export default SavedPost;
