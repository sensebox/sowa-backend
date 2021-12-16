var express = require('express');
var router = express.Router();
//var bodyParser = require("body-parser");
var Filter = require('../middleware/filter');

const DomainsController = require('../controllers/domains-controller');
const AuthController = require('../controllers/auth-controller');
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
    .then(data => {
      if (req.query.lang) {
        data = Filter.filterData(data, req.query.lang);
      }
      if(req.query.format === 'json'){
        return res.json(DomainsController.convertDomainToJson(data))
      } else {
        return res.json(data);
      }
    })
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
  // LOCALS contains the user now including the role
  DomainsController.createNewDomain(req.body, res.locals.user.role)
  DomainsController.createHistoryDomain(req.body, res.locals.user)
    .then(res.json(req.body))
});

router.post('/domain/edit/', function (req, res) {
  // LOCALS contains the user now including the role
  console.dir(req.body);
  DomainsController.editDomain(req.body, res.locals.user.role)
  DomainsController.createHistoryDomain(req.body, res.locals.user)
  .then(res.json(req.body))
});

router.post('/domain/delete/', function (req, res) {
  console.log(req.body);
  DomainsController.deleteDomain(req.body, res.locals.user.role)
    .then(res.json(req.body))
});


module.exports = router;
