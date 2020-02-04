var express = require('express');
var router = express.Router();

const QueriesController = require('../controllers/queries-controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'This is the Proxy Server of SOWA' });
});

module.exports = router;

/* ---------- All domain funtions: -----------------*/
router.get('/units', function (req, res) {
  QueriesController.getUnits()
    .then(data => res.json(data))
});
