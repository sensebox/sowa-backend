var express = require('express');
var router = express.Router();
//var bodyParser = require("body-parser");

const PhenomenaController = require('../controllers/phenomena-controller');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


/* ---------- All phenomenon funtions: -----------------*/
router.get('/all', function (req, res) {
  PhenomenaController.getPhenomena()
    .then(data => res.json(data))
});

router.get('/phenomenon/:iri', function (req, res) {
  console.log(req);
  PhenomenaController.getPhenomenon(req.params.iri)
    .then(data => res.json(data))
});

router.get('/phenomenonDEPRECATED/:iri', function (req, res) {
  console.log(req);
  PhenomenaController.getPhenomenonDEPRECATED(req.params.iri)
    .then(data => res.json(data))
});

router.post('/phenomenon/update/', function (req, res) {
  PhenomenaController.updatePhenomenon(req.body)
    .then(res.end("END"))
});

router.post('/phenomenon/edit/', function (req, res) {
  console.dir(req.body);
  PhenomenaController.editPhenomenon(req.body)
    .then(res.end("END"))
});



module.exports = router;
