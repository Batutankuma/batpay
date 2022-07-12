var express = require('express');
var router = express.Router();
var Controllers = require('./../controllers/entreprise_models');
var controllers = new Controllers();

router.post('/entreprise/signup',controllers.singUp);
router.post('/entreprise/login',controllers.loginIn);
router.get('/entreprise/all',controllers.read);
router.get('/entreprise/:id',controllers.readId);
router.delete('/entreprise/:id',controllers.deleteId);

module.exports = router;
