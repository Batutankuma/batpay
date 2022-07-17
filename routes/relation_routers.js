var express = require('express');
var router = express.Router();
var Auth = require('./../middlewares/tokenJwt');
var Controllers = require('./../controllers/relation_models');
var controllers = new Controllers();
var {verifyToken} = new Auth();

//client
// !les routes à verifier
//TODO 
router.post('/relation/:relation',verifyToken,controllers.add);
router.delete('/relation/:relation',verifyToken,controllers.delete);
router.get('/relation/list',verifyToken,controllers.list);

module.exports = router;
