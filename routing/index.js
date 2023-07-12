const router = require('express').Router();
const {
  homeCtrl,
  servicesCtrl,
  contactCtrl,
  usersCtrl,
  tasksCtrl
} = require('../controllers/app.ctrl');
/*
const {
  usersCtrl
} = require("../controllers/app.ctrl");*/

router.get('/home', homeCtrl);
router.get('/users', usersCtrl);
router.get('/users/:id', tasksCtrl)

router.get('/services', servicesCtrl);
router.get('/contact', contactCtrl);

router.get('*', (req, res) => res.redirect('/home'));

module.exports = router;