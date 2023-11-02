import mongoose, { Schema, Document } from "mongoose";

// Define the Contact interface
export interface IContact extends Document {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

// Create a Mongoose schema for Contact
const contactSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Contact model
const ContactModel = mongoose.model<IContact>("Form", contactSchema);

export default ContactModel;
