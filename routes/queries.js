var express = require('express');
var router = express.Router();
//var bodyParser = require("body-parser");

const QueriesController = require('../controllers/queries-controller');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/* ---------- All phenomenon funtions: -----------------*/
router.get('/phenomena',function(req,res){
    QueriesController.getPhenomena()
    .then(data => res.json(data))
  });

router.get('/phenomenon/:iri',function(req,res){
  console.log(req);
    QueriesController.getPhenomenon(req.params.iri)
    .then(data => res.json(data))
});

router.post('/phenomenon/update/',function(req,res){
  console.dir(req.body);
  QueriesController.updatePhenomenon(req.body)
  .then(res.end("END"))
});


/* ---------- All domain funtions: -----------------*/
router.get('/domains',function(req,res){
  QueriesController.getDomains()
  .then(data => res.json(data))
});

router.get('/domain/:iri',function(req,res){
console.log(req);
  QueriesController.getDomain(req.params.iri)
  .then(data => res.json(data))
});

router.post('/domain/update/',function(req,res){
console.dir(req.body);
QueriesController.updateDomain(req.body)
.then(res.end("END"))
});


/* ---------- All sensor funtions: -----------------*/
router.get('/sensors',function(req,res){
    QueriesController.getSensors()
    .then(data => res.json(data))
});

router.get('/sensor/:iri',function(req,res){
  console.log(req);
    QueriesController.getSensor(req.params.iri)
    .then(data => res.json(data))
});

router.post('/sensor/update/',function(req,res){
  console.dir(req.body);
  QueriesController.updateSensor(req.body)
  .then(res.end("END"))
});


/* ---------- All device funtions: -----------------*/
router.get('/devices',function(req,res){
  QueriesController.getDevices()
  .then(data => res.json(data))
});

router.get('/device/:iri',function(req,res){
  console.log(req);
    QueriesController.getDevice(req.params.iri)
    .then(data => res.json(data))
  });
  
  router.post('/device/update/',function(req,res){
  console.dir(req.body);
  QueriesController.updateDevice(req.body)
  .then(res.end("END"))
  });
  



/** get all x for a given y */
router.get('/phenomenaforsensor/:iri',function(req,res){
  QueriesController.getPhenomenaForSensor(req.params.iri)
  .then(data => res.json(data))
});

router.get('/sensorsforphenomenon/:iri',function(req,res){
  QueriesController.getSensorsForPhenomenon(req.params.iri)
  .then(data => res.json(data))
});

router.get('/sensorsfordevice/:iri',function(req,res){
  QueriesController.getSensorsForDevice(req.params.iri)
  .then(data => res.json(data))
});

router.get('/phenomenafordomain/:iri',function(req,res){
  QueriesController.getPhenomenaForDomain(req.params.iri)
  .then(data => res.json(data))
});

router.get('/unitsforphenomenon/:iri',function(req,res){
  QueriesController.getUnitsForPhenomenon(req.params.iri)
  .then(data => res.json(data))
});


module.exports = router;
