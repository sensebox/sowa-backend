var express = require('express');
var router = express.Router();

const QueriesController = require('../controllers/queries-controller');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'This is the Proxy Server of SOWA' });
});

module.exports = router;

/* ---------- All domain funtions: -----------------*/
router.get('/units', function (req, res) {
  QueriesController.getUnits()
    .then(data => res.json(data))
});

router.get('/unit/http://purl.obolibrary.org/obo/:iri', function (req, res) {
  console.log(req)
  QueriesController.getUnitLabel(req.params.iri)
  .then(data => res.json(data))
});

