import dotenv from "dotenv";
dotenv.config();
import express from "express";

import cors from "cors";
import userRouter from "./routers/user.router";
import { dbConnect } from "./database.config";
import postRouter from "./routers/post.router";
import path from "path"; // Import 'path' module
import mongoose from "mongoose";
import { UserSchema } from "./models/user.model";
dbConnect();

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);

const UserModel = mongoose.model("User", UserSchema);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/users", userRouter);
app.use("/api", postRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("website served on http://localhost:" + port);
});
