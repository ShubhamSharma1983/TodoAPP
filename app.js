const express = require("express");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const myTodos = ["Buy groceries", "Finish coding EJS layout", "Walk the dog"];
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
  const date = require(__dirname + "/views/date.js");
  day = date.getDate();
  res.render("index", { title: day, myTodos: myTodos });
});

app.post("/", function (req, res) {
  //   console.log(req.body.addTodo);
  if (req.body.addTodo == "Work") {
    workTodos.push(req.body.newTodo);
    res.redirect("/work");
  } else {
    myTodos.push(req.body.newTodo);
    res.redirect("/");
  }
});

app.get("/work", function (req, res) {
  res.render("index", { title: "Work Todos", myTodos: workTodos });
});

app.listen(8080, function () {
  console.log("Server running at 8080.");
});
