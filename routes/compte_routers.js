var express = require('express');
var router = express.Router();
var Controllers = require('./../controllers/compte_models');
var controllers = new Controllers();

//client
router.get('/compte/client/all',controllers.readForClient);

//developper
router.get('/compte/developper/:key',controllers.readForDevelopper);
router.get('/compte/entreprise/:id',controllers.readId);
router.patch('/compte/entreprise/:id',controllers.updateId);
router.delete('/compte/entreprise/:id',controllers.deleteId);

module.exports = router;
