import express, { Request, Response } from "express";
import auth from "../middlewares/auth.mid";
import asyncHandler from "express-async-handler";
import fs from "fs";
import Comment from "../models/comments.model";
import Image from "../models/post.model";
const router = express.Router();
router.use(auth);

router.post(
  "/images/:postId/comments",
  asyncHandler(async (req: any, res: any) => {
    try {
      const { text } = req.body;
      const { postId } = req.params;
      const userId = req.user.id;

      const comment = new Comment({
        text,
        author: userId,
        post: postId,
      });
      await comment.save();

      const post = await Image.findById(postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      post.comments.push(comment._id);
      await post.save();

      res.json(comment);
    } catch (error) {
      res.status(500).json({ error: "Error creating comment" });
    }
  })
);

router.get(
  "/images/:postId/comments",
  asyncHandler(async (req: any, res: any) => {
    try {
      // Parse the request parameters
      const { postId } = req.params;

      const post = await Image.findById(postId).populate({
        path: "comments",
        populate: {
          path: "author", // Populate the 'author' field in comments
          model: "User", // Reference the User model
          select: "name", // Select the 'name' field from the User model
        },
      });

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Return the comments for the post
      res.json(post.comments);
    } catch (error) {
      res.status(500).json({ error: "Error fetching comments" });
    }
  })
);

// Delete a specific comment (only if the user is the author)
router.delete(
  "/:commentId",
  asyncHandler(async (req: any, res: any) => {
    const commentId = req.params.commentId;
    const userId = req.user.id;

    try {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      if (comment.author.toString() !== userId) {
        return res.status(403).json({ error: "Permission denied" });
      }

      // Remove the comment's reference from the post's comments array
      const post = await Image.findById(comment.post);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Find and remove the comment's ID from the post's comments array
      post.comments = post.comments.filter(
        (commentRef) => commentRef.toString() !== commentId
      );

      // Save the updated post
      await post.save();

      // Delete the comment document
      await Comment.deleteOne({ _id: commentId });

      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting comment" });
    }
  })
);

export default router;
