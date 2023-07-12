const { resolve } = require('path');
const { users, tasks } = require('../db/db.json')

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

