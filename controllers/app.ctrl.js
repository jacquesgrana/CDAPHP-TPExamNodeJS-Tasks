const { resolve } = require('path');
let { users, tasks } = require('../db/db.json');
const { randomUUID } = require("crypto");
const { writeFileSync} = require("fs");

exports.homeCtrl = (req, res) => {
  res.sendFile( resolve('public', 'home.html') );
};

exports.usersCtrl = (req, res) => {
  console.log("appel users ctrl");
  console.log("users :", users);
  //console.log('body :', req.body);
  res.json(users);
};

exports.tasksCtrl = (req, res) => {
  console.log('tasksCtrl id :', req.params.id);
  const filteredTasks = tasks.filter(t => t.idUtil == req.params.id);
  res.json(filteredTasks);
}

/**
 * A FINIR !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * @param {*} req 
 * @param {*} res 
 */
exports.addTaskCtrl = (req, res) => {
  console.log("req.body :", req.body);
  //console.log("JSON.parse(req.body) :", JSON.parse(req.body));
    const { text, prio, done, idUtil } = req.body;
    
    const id = randomUUID();
    const newTask = { id, text, prio, done, idUtil};
    //const newTask = createNewTask(text, prio, done, idUtil); // Remplacez cette ligne avec la logique réelle pour créer une tâche
    tasks.push(newTask);
    updateJSON();
    res.status(201).json(newTask);
}
/*
exports.postTask = (req, res) => {
        const newTodo = req.body;
        console.log(req.body,req);
        newTodo.id = randomUUID();
        console.log(body,newTodo);
        newTodo.done = false;
        todos.push(newTodo);
        updateJSON();
        res.redirect('/home');
      };
*/

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
  //const idTab = tasks.findIndex(taskToUpdate);
  //tasks[idTab] = newTask;
  //taskToUpdate = newTask;
  taskToUpdate.text = newTask.text;
  taskToUpdate.prio = newTask.prio;
  updateJSON();
  res.status(201).json(newTask);
}


function updateJSON() {
  writeFileSync(
    resolve('db', 'db.json'),
    JSON.stringify({ users, tasks }, null, 2)
  );
}
