var express = require('express');
var router = express.Router();
//var bodyParser = require("body-parser");

const DevicesController = require('../controllers/devices-controller');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


/* ---------- All device funtions: -----------------*/
router.get('/all', function (req, res) {
  DevicesController.getDevices()
    .then(data => res.json(data))
});

router.get('/device/:iri', function (req, res) {
  console.log(req);
  DevicesController.getDevice(req.params.iri)
    .then(data => res.json(data))
});

router.post('/device/update/', function (req, res) {
  console.dir(req.body);
  DevicesController.updateDevice(req.body)
    .then(res.end("END"))
});

router.post('/device/edit/', function (req, res) {
  console.dir(req.body);
  DevicesController.editDevice(req.body)
    .then(res.end("END"))
});



module.exports = router;
