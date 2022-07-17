var express = require('express');
var router = express.Router();
var Controllers = require('./../controllers/developper_models');
var controllers = new Controllers();

router.post('/developper/signup', controllers.singUp);
router.post('/developper/login', controllers.loginIn);
router.get('/developper/:key/all', controllers.findAll);
router.get('/developper/:key', controllers.findId);
router.get('/developper/:key/email', controllers.findForPhone);
router.get('/developper/:key/username', controllers.findForPhone);
router.patch('/developper/:key/id', controllers.updateId);
router.delete('/developper/:key/id', controllers.deleteId);

module.exports = router;
