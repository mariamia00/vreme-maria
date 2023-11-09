import express, { Request, Response } from "express";
import { Person } from "./person.model";

const personRouter = express.Router();

// GET all people
personRouter.get("/", async (req: Request, res: Response) => {
  try {
    const people = await Person.find();
    res.status(200).json(people);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST a new person
personRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { name, age, job } = req.body;
    if (!name || !age || !job) {
      return res
        .status(400)
        .json({ error: "All fields (name, age, job) are required." });
    }
    const newPerson = new Person({ name, age, job });
    const savedPerson = await newPerson.save();
    res.status(201).json(savedPerson);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE a person by ID
personRouter.delete("/:_id", async (req: Request, res: Response) => {
  try {
    const person = await Person.findByIdAndDelete(req.params._id);
    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.status(200).json(person);
  } catch (error) {
    console.error("Error in DELETE /api/people/:_id:", error); // Log the error
    res.status(500).json({ error: "Server error" });
  }
});

export { personRouter };
