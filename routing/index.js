const router = require('express').Router();
const {
  homeCtrl,
  usersCtrl,
  tasksCtrl,
  addTaskCtrl,
  deleteTaskCtrl,
  updateTask,
  toggleTaskCtrl
} = require('../controllers/app.ctrl');

router.get('/home', homeCtrl);
router.get('/users', usersCtrl);
router.post('/tasks', addTaskCtrl);
router.get('/tasks/user/:id', tasksCtrl);
router.delete('/tasks/:id', deleteTaskCtrl);
router.patch('/tasks/:id', updateTask); ///tasks/toggle/
router.patch('/tasks/toggle/:id', toggleTaskCtrl);
router.get('*', (req, res) => res.redirect('/home'));

module.exports = router;