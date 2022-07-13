var express = require('express');
var router = express.Router();
var Controllers = require('../controllers/transfert_models');
var controllers = new Controllers();

/**
 *  Operation developper
*/

//recev
router.post('/operation/transfert/developper',controllers.ForDevelopper);
router.get('/historique/transfert/developper/:key',controllers.historiqueDevelopperRecevTransfert);
//read all 
router.get('/operation/transfert/developper/:id',controllers.readAll);

/**
 *  Operation Client
*/

router.post('/operation/transfert/client/:id',controllers.clientForClient);


module.exports = router;
