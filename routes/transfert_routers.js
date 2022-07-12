var express = require('express');
var router = express.Router();
var Controllers = require('../controllers/transfert_models');
var controllers = new Controllers();

router.post('/operation/transfert/entreprise/:id',controllers.btoc);
router.get('/historique/transfert/entreprise/:id',controllers.historiqueEntrepriseTransfert);
//read all 
router.get('/operation/transfert/entreprise/:id',controllers.readAll);

router.post('/operation/transfert/client/:id',controllers.btoc);


module.exports = router;
