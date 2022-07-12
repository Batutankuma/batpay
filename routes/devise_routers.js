var express = require('express');
var router = express.Router();
var Controllers = require('./../controllers/devise_models');
var controllers = new Controllers();

router.post('/compte/entreprise',controllers.create);
router.get('/compte/entreprise/all',controllers.read);
router.get('/compte/entreprise/:id',controllers.readId);
router.patch('/compte/entreprise/:id',controllers.updateId);
router.delete('/compte/entreprise/:id',controllers.deleteId);

module.exports = router;
