var express = require('express');
var router = express.Router();
var Controllers = require('../controllers/transfert_models');
var controllers = new Controllers();

//Operation developper
router.post('/operation/transfert/developper/:id',controllers.clientForDevelopper);
router.get('/historique/transfert/developper/:id',controllers.historiqueDevelopperTransfert);
//read all 
router.get('/operation/transfert/developper/:id',controllers.readAll);

router.post('/operation/transfert/client/:id',controllers.clientForClient);


module.exports = router;
