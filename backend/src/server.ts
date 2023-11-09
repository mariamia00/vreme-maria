import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import { personRouter } from "./person.router";
import cors from "cors";
import path from "path";
import { dbConnect } from "./database.config";

dbConnect();
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    origin: ["http://localhost:4200"],
  })
);

app.use(bodyParser.json());

app.use("/api/people", personRouter);

// app.use(express.static(path.join(__dirname, "../../frontend/dist/weather/")));

// Catch-all route to serve Angular's index.html
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../../frontend/dist/weather/index.html"));
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
