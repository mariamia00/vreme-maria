import mongoose, { Schema, Document, Types } from "mongoose";

export interface IImage extends Document {
  title: string;
  imageUrl: string;
  author: Types.ObjectId;
  createdAt: Date;
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
});

const Image = mongoose.model<IImage>("Image", imageSchema);

export default Image;
