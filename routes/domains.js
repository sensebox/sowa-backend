var express = require('express');
var router = express.Router();
//var bodyParser = require("body-parser");

const DomainsController = require('../controllers/domains-controller');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


/* ---------- All domain funtions: -----------------*/
router.get('/all', function (req, res) {
  DomainsController.getDomains()
    .then(data => res.json(data))
});

router.get('/domain/:iri', function (req, res) {
  console.log(req);
  DomainsController.getDomain(req.params.iri)
    .then(data => res.json(data))
});

router.get('/historic-domain/:iri', function (req, res) {
  console.log(req.params.iri);
  DomainsController.getHistoricDomain(req.params.iri)
    .then(data => res.json(data))
});

router.get('/domain-history/:iri', function (req, res) {
  console.log(req.params.iri);
  DomainsController.getDomainHistory(req.params.iri)
    .then(data => res.json(data))
});

router.post('/domain/create/', function (req, res) {
  console.log(req.body);
  DomainsController.createNewDomain(req.body)
  DomainsController.createHistoryDomain(req.body)
    .then(res.json(req.body))
});

router.post('/domain/edit/', function (req, res) {
  console.dir(req.body);
  DomainsController.editDomain(req.body)
  DomainsController.createHistoryDomain(req.body)
  .then(res.json(req.body))
});


module.exports = router;
