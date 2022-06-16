var express = require('express');
var router = express.Router();
//var bodyParser = require("body-parser");
var Filter = require('../middleware/filter');

const UnitsController = require('../controllers/units-controller');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* ---------- All units funtions: -----------------*/
router.get('/all', function (req, res) {
    UnitsController.getUnits(req.query.lang)
      .then(data => {
        return res.json(data);
      })
});

router.get('/unit/:iri', function (req, res) {
  UnitsController.getUnit(req.params.iri, req.query.lang).then(data => {
    return res.json(data);
  })
});

router.post('/unit/create/', function (req, res) {
  // LOCALS contains the user now including the role
  UnitsController.createNewUnit(req.body, res.locals.user.role)
    .then(res.json(req.body))
});

router.post('/unit/edit/', function (req, res) {
  // LOCALS contains the user now including the role
  // console.dir(req.body);
  UnitsController.editUnit(req.body, res.locals.user.role)
    .then(res.json(req.body))
});

router.post('/unit/delete/', function (req, res) {
  // console.log(req.body);
  UnitsController.deleteUnit(req.body, res.locals.user.role)
    .then(res.json(req.body))
});

module.exports = router;