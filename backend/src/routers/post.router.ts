import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import Image from "../models/post.model";
import auth from "../middlewares/auth.mid";
import asyncHandler from "express-async-handler";
import fs from "fs";
import { UserModel } from "../models/user.model";
import Comment from "../models/comments.model";

const router = express.Router();
router.use(auth);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// POST route to upload an image and title
router.post(
  "/images",
  upload.single("image"),
  asyncHandler(async (req: any, res: any) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { title } = req.body;
      const imageUrl = req.file.path;

      const newImage = new Image({
        title,
        imageUrl: req.file.filename,
        author: req.user.id,
      });
      await newImage.save();

      res.status(200).json({ message: "Image saved successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  })
);

// GET route to retrieve all images
router.get("/images", async (req: Request, res: Response) => {
  try {
    const images = await Image.find(
      {},
      "_id title imageUrl author comments"
    ).populate("comments");

    // Iterate through the images and fetch author names
    const imagesWithAuthors = await Promise.all(
      images.map(async (image) => {
        const author = await UserModel.findById(image.author);
        if (author) {
          return {
            _id: image._id,
            title: image.title,
            imageUrl: image.imageUrl,
            authorName: author.name,
            author: author._id,
          };
        } else {
          return null; // Handle the case where the author is not found
        }
      })
    );

    // Filter out null values (if any)
    const validImagesWithAuthors = imagesWithAuthors.filter(
      (image) => image !== null
    );

    // Send the list of images with author names as a JSON response
    res.json(validImagesWithAuthors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete(
  "/images/:postId",
  asyncHandler(async (req: any, res: any) => {
    try {
      const postId = req.params.postId;
      const userId = req.user.id;

      // Find the post
      const post = await Image.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Check if the user is the author of the post
      if (post.author.toString() !== userId) {
        return res.status(403).json({ message: "Permission denied" });
      }

      // Delete the post from the database
      await Image.deleteOne({ _id: postId });

      // Delete associated comments
      await Comment.deleteMany({ post: postId });

      const imagePath = path.join(__dirname, "..", "uploads", post.imageUrl);

      if (fs.existsSync(imagePath)) {
        // Delete the image file
        fs.unlinkSync(imagePath);
      }

      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  })
);

export default router;
