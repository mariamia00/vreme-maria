import mongoose, { Schema, Document, Types } from "mongoose";

export interface IImage extends Document {
  title: string;
  imageUrl: string;
  author: Types.ObjectId;
  createdAt: Date;
  comments: Types.ObjectId[];
}

const imageSchema: Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

const Image = mongoose.model<IImage>("Image", imageSchema);

export default Image;
