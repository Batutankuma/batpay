var express = require('express');
var Auth = require('./../middlewares/tokenJwt');
var router = express.Router();
var Controllers = require('./../controllers/client_models');
var controllers = new Controllers();
var {verifyToken} = new Auth();

router.post('/client/signup',controllers.singUp);
router.post('/client/login',controllers.loginIn);
router.get('/client/all',verifyToken,controllers.findAll);
router.get('/client/:id',verifyToken,controllers.findId);
router.get('/client/phone/:phone',verifyToken,controllers.findForPhone);
router.delete('/client/:id',verifyToken,controllers.deleteId);

module.exports = router;
