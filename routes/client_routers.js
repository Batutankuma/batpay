var express = require('express');
var router = express.Router();
var Controllers = require('./../controllers/client_models');
var controllers = new Controllers();

router.post('/client/signup',controllers.singUp);
router.post('/client/login',controllers.loginIn);
router.get('/client/all',controllers.read);
router.get('/client/:id',controllers.readId);
router.delete('/client/:id',controllers.deleteId);

module.exports = router;
