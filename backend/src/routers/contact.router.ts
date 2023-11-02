import express from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import ContactModel from "../models/contact.model";

const router = express.Router();
router.post(
  "/contact",
  asyncHandler(async (req: any, res: any) => {
    try {
      const { name, email, message } = req.body;

      // Form validation
      if (!name || !email || !message) {
        return res.status(400).send("All fields are required");
      }

      // Create a new contact object
      const newContact = new ContactModel({
        name,
        email,
        message,
      });

      // Save the contact to the database
      await newContact.save();

      // If everything is successful, send a response
      res.status(200).json({ message: "Form created and sent successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while processing your request.");
    }
  })
);

export default router;
