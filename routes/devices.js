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

// router.post('/device/update/', function (req, res) {
//   console.dir(req.body);
//   DevicesController.updateDevice(req.body)
//     .then(res.end("END"))
// });

router.get('/historic-device/:iri', function (req, res) {
  console.log(req.params.iri);
  DevicesController.getHistoricDevice(req.params.iri)
    .then(data => res.json(data))
});

router.get('/device-history/:iri', function (req, res) {
  console.log(req.params.iri);
  DevicesController.getDeviceHistory(req.params.iri)
    .then(data => res.json(data))
});

router.post('/device/create/', function (req, res) {
  console.log(req.body);
  DevicesController.createNewDevice(req.body, res.locals.user.role)
  DevicesController.createHistoryDevice(req.body, res.locals.user)
  .then(res.json(req.body))
});

router.post('/device/edit/', function (req, res) {
  console.dir(req.body);
  DevicesController.editDevice(req.body, res.locals.user.role)
  DevicesController.createHistoryDevice(req.body, res.locals.user)
  .then(res.json(req.body))
});

// router.post('/device/add/', function (req, res) {
//   console.dir(req.body);
//   DevicesController.addDevice(req.body)
//   DevicesController.createHistoryDevice(req.body)
//   .then(data => res.json(data))
// });



module.exports = router;
