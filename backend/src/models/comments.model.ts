// comment.interface.ts
import mongoose, { Document, Schema } from "mongoose";

export interface Comment extends Document {
  text: string;
  author: string;
  post: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Image", // Reference to the Image (post) model
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model<Comment>("Comment", commentSchema);

export default Comment;
