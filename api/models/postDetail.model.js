import mongoose from "mongoose";

const { Schema } = mongoose;

const PostDetailSchema = new Schema(
  {
    desc: {
      type: String,
      required: true,
    },
    utilities: {
      type: String,
      default: null,
    },
    pet: {
      type: String,
      default: null,
    },
    income: {
      type: String,
      default: null,
    },
    size: {
      type: Number,
      default: null,
    },
    school: {
      type: Number,
      default: null,
    },
    bus: {
      type: Number,
      default: null,
    },
    restaurant: {
      type: Number,
      default: null,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

const PostDetail = mongoose.model("PostDetail", PostDetailSchema);

export default PostDetail;
