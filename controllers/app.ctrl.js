const { resolve } = require('path');
const { users, tasks } = require('../db/db.json');
const { randomUUID } = require("crypto");

exports.homeCtrl = (req, res) => {
  res.sendFile( resolve('public', 'home.html') );
};

exports.servicesCtrl = (req, res) => {
  // Connexion à la BDD
  // Récupération des livres
  // Vérification de la cnx
  res.end('Services');
};

exports.contactCtrl = (req, res) => res.end('Contact');

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
  console.log("req body :", req.body);
  const newId = randomUUID();
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


function updateJSON() {
  writeFileSync(
    resolve('db', 'db.json'),
    JSON.stringify({ todos, users }, null, 2)
  );
}
