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
router.get('/users/:id', tasksCtrl);
router.post('/users', addTaskCtrl)

router.get('*', (req, res) => res.redirect('/home'));

module.exports = router;