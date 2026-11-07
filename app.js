const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose
  .connect("mongodb://127.0.0.1:27017/todo")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed:", err.message));

const todoSchema = new mongoose.Schema({
  todo: String,
});

const Todo = mongoose.model("Todo", todoSchema);
// const firstTodo = new Todo({ todo: "Walk the dog" });
// firstTodo.save();

const workTodos = [];

app.get("/", function (req, res) {
  //   const date = new Date();
  //   const day = date.getDate();
  //   const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
  //   const monthName = date.toLocaleDateString("en-US", { month: "long" });
  //   const dateObject = {
  //     dayName: dayName,
  //     monthName: monthName,
  //     day: day,
  //   };
  Todo.find({})
    .then((todos) => {
      // console.log(todos);
      const date = require(__dirname + "/views/date.js");
      day = date.getDate();
      res.render("index", { title: day, myTodos: todos });
    })
    .catch((err) => {
      console.error("Failed to extract Todos:", err.message);
    });
});

app.post("/", function (req, res) {
  //   console.log(req.body.addTodo);
  if (req.body.addTodo == "Work") {
    workTodos.push(req.body.newTodo);
    res.redirect("/work");
  } else {
    // myTodos.push(req.body.newTodo);
    const newTodo = new Todo({
      todo: req.body.newTodo,
    });
    newTodo
      .save()
      .then(() => {
        console.log("Item added successfully.");
        res.redirect("/");
      })
      .catch((err) => {
        console.error("Failed to add new item: ", err.message);
      });
  }
});

app.post("/delete", function (req, res) {
  const id = req.body.checkboxItem;
  Todo.findByIdAndDelete(id)
    .then((item) => {
      if (!item) {
        console.log("Such item don't exist.");
      } else {
        console.log("Item deleted successfully.");
      }
      res.redirect("/");
    })
    .catch((err) => {
      console.log("Failed to delete: ", err.message);
      res.redirect("/");
    });
});

app.get("/work", function (req, res) {
  res.render("index", { title: "Work Todos", myTodos: workTodos });
});

app.listen(8080, function () {
  console.log("Server running at 8080.");
});
