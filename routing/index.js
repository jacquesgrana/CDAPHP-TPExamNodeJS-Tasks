const router = require('express').Router();
const {
  homeCtrl,
  usersCtrl,
  tasksCtrl,
  addTaskCtrl
} = require('../controllers/app.ctrl');
/*
const {
  usersCtrl
} = require("../controllers/app.ctrl");*/

router.get('/home', homeCtrl);
router.get('/users', usersCtrl);
router.post('/users', addTaskCtrl);

router.get('/tasks/user/:id', tasksCtrl);

router.get('*', (req, res) => res.redirect('/home'));

module.exports = router;