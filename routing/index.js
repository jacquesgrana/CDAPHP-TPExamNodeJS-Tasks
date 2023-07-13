const router = require('express').Router();
const {
  homeCtrl,
  usersCtrl,
  tasksCtrl,
  addTaskCtrl,
  deleteTaskCtrl,
  updateTask
} = require('../controllers/app.ctrl');
/*
const {
  usersCtrl
} = require("../controllers/app.ctrl");*/

router.get('/home', homeCtrl);
router.get('/users', usersCtrl);
router.post('/tasks', addTaskCtrl);

router.get('/tasks/user/:id', tasksCtrl);
router.delete('/tasks/:id', deleteTaskCtrl);
router.patch('/tasks/:id', updateTask);

router.get('*', (req, res) => res.redirect('/home'));

module.exports = router;