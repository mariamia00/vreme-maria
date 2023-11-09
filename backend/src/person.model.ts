// src/models/person.model.ts
import mongoose, { Document, Schema, Model } from "mongoose";

interface IPerson {
  name: string;
  age: number;
  job: string;
}

interface IPersonDocument extends IPerson, Document {}

const personSchema = new Schema<IPersonDocument>({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  job: {
    type: String,
    required: true,
  },
});
export const Person: Model<IPersonDocument> = mongoose.model<IPersonDocument>(
  "Person",
  personSchema
);
