import express, { json } from "express";
import { connect, model, Schema } from "mongoose";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(json());
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/Todo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  });

const Todo = model("Todo", new Schema({ text: String }));

app.get("/todo", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/todo", async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });
  await todo.save();
  res.json(todo);
});

app.put("/todo/:id", async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    { text: req.body.text },
    { new: true }
  );
  res.json(todo);
});

app.delete("/todo/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
