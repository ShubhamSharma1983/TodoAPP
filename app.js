const express = require("express");
const mongoose = require("mongoose");
const capitalize = require("capitalize");
require("dotenv").config();

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed:", err.message));

const todoSchema = new mongoose.Schema({
  todo: String,
});

const listSchema = new mongoose.Schema({
  name: String,
  todos: [todoSchema],
});

const TodoList = mongoose.model("TodoList", listSchema);
// const firstTodo = new Todo({ todo: "Walk the dog" });
// firstTodo.save();

const workTodos = [];

app.get("/", function (req, res) {
  const listName = "Today";
  const date = require(__dirname + "/views/date.js");
  const day = date.getDate();
  TodoList.findOne({ name: listName })
    .then(async (list) => {
      if (!list) {
        list = new TodoList({
          name: listName,
          todos: [],
        });
        await list.save();
      }
      res.render("index", { title: day, todoList: list });
    })
    .catch((err) => {
      console.error("Failed to extract Todos:", err.message);
    });
});

app.post("/", function (req, res) {
  TodoList.findOne({ _id: req.body.listId })
    .then(async (list) => {
      if (!list) {
        console.log("List don't exists in the collection");
        res.redirect("/");
      } else {
        list.todos.push({ todo: req.body.todoText });
        await list.save();
        if (list.name == "Today") {
          res.redirect("/");
        } else {
          res.redirect("/" + list.name);
        }
      }
    })
    .catch((err) => {
      console.error("Failed to connect to database to find list", err.message);
      res.redirect("/");
    });
});

app.post("/delete", function (req, res) {
  TodoList.findOne({ _id: req.body.listId })
    .then(async (list) => {
      if (!list) {
        console.log("List don't exists in the collection");
        res.redirect("/");
      } else {
        list.todos.pull({ _id: req.body.todoId });
        await list.save();
        if (list.name == "Today") {
          res.redirect("/");
        } else {
          res.redirect("/" + list.name);
        }
      }
    })
    .catch((err) => {
      console.error("Failed to connect to database to find list", err.message);
      res.redirect("/");
    });
});

app.get("/:listName", function (req, res) {
  var listName = req.params.listName;
  listName = capitalize(listName);

  TodoList.findOne({ name: listName })
    .then(async (list) => {
      if (!list) {
        list = new TodoList({
          name: listName,
          todos: [],
        });
        await list.save();
      }
      res.render("index", { title: list.name, todoList: list });
    })
    .catch((err) => {
      console.error("Failed to extract Todos:", err.message);
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log("Server running at 8080.");
});

//   const date = new Date();
//   const day = date.getDate();
//   const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
//   const monthName = date.toLocaleDateString("en-US", { month: "long" });
//   const dateObject = {
//     dayName: dayName,
//     monthName: monthName,
//     day: day,
//   };
