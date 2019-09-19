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

router.post('/domain/update/', function (req, res) {
  console.dir(req.body);
  DomainsController.updateDomain(req.body)
    .then(res.end("END"))
});


module.exports = router;
