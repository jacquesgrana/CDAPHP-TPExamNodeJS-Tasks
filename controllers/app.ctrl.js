const { resolve } = require('path');
let { users, tasks } = require('../db/db.json');
const { randomUUID } = require("crypto");
const { writeFileSync} = require("fs");

exports.homeCtrl = (req, res) => {
  res.sendFile( resolve('public', 'home.html') );
};

exports.usersCtrl = (req, res) => {
  res.json(users);
};

exports.tasksCtrl = (req, res) => {
  const filteredTasks = tasks.filter(t => t.idUtil == req.params.id);
  res.json(filteredTasks);
}

exports.addTaskCtrl = (req, res) => {
    const { text, prio, done, idUtil } = req.body;
    const id = randomUUID();
    const newTask = { id, text, prio, done, idUtil};
    tasks.push(newTask);
    updateJSON();
    res.status(201).json(newTask);
}

exports.deleteTaskCtrl = (req, res) => {
  const id = req.params.id;
  tasks = tasks.filter(t => t.id !== id);
  updateJSON();
  res.status(200).json(id);
}

exports.updateTask = (req, res) => {
  console.log("update task req.body :", req.body);
  const idUrl = req.params.id;
  const newTask = req.body;
  let taskToUpdate = tasks.find(t => t.id === idUrl);
  taskToUpdate.text = newTask.text;
  taskToUpdate.prio = newTask.prio;
  updateJSON();
  res.status(201).json(newTask);
}

exports.toggleTaskCtrl = (req, res) => {
  const id = req.params.id;
  let taskToUpdate = tasks.find(t => t.id === id);
  taskToUpdate.done = !taskToUpdate.done;
  updateJSON();
  res.status(201).json(taskToUpdate.done);
}


function updateJSON() {
  writeFileSync(
    resolve('db', 'db.json'),
    JSON.stringify({ users, tasks }, null, 2)
  );
}
