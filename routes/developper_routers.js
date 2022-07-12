var express = require('express');
var router = express.Router();
var Controllers = require('./../controllers/developper_models');
var controllers = new Controllers();

router.post('/developper/signup', controllers.singUp);
router.post('/developper/login', controllers.loginIn);
router.get('/developper/all', controllers.findAll);
router.get('/developper/:id', controllers.findId);
router.get('/developper/:email', controllers.findForEmail);
router.get('/developper/:username', controllers.findForUsername);
router.patch('/developper/:id', controllers.updateId);
router.delete('/developper/:id', controllers.deleteId);

module.exports = router;
