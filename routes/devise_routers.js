var express = require('express');
var router = express.Router();
var Controllers = require('./../controllers/devise_models');
var controllers = new Controllers();

router.post('/devise',controllers.create);
router.get('/devise/all',controllers.read);
router.get('/devise/:id',controllers.readId);
router.patch('/devise/:id',controllers.updateId);
router.delete('/devise/:id',controllers.deleteId);

module.exports = router;
