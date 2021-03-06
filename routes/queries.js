var express = require('express');
var router = express.Router();
//var bodyParser = require("body-parser");

const QueriesController = require('../controllers/queries-controller');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


/* ---------- All phenomenon funtions: -----------------*/
router.get('/phenomena', function (req, res) {
  console.log(req);
  QueriesController.getPhenomena()
    .then(data => res.json(data))
});

router.get('/phenomenon/:iri', function (req, res) {
  console.log(req);
  QueriesController.getPhenomenon(req.params.iri)
    .then(data => res.json(data))
});

router.get('/phenomenonDEPRECATED/:iri', function (req, res) {
  console.log(req);
  QueriesController.getPhenomenonDEPRECATED(req.params.iri)
    .then(data => res.json(data))
});

router.post('/phenomenon/update/', function (req, res) {
  QueriesController.updatePhenomenon(req.body)
    .then(res.end("END"))
});

router.post('/phenomenon/edit/', function (req, res) {
  console.dir(req.body);
  QueriesController.editPhenomenon(req.body)
    .then(res.end("END"))
});



/* ---------- All domain funtions: -----------------*/
router.get('/domains', function (req, res) {
  QueriesController.getDomains()
    .then(data => res.json(data))
});

router.get('/domain/:iri', function (req, res) {
  console.log(req);
  QueriesController.getDomain(req.params.iri)
    .then(data => res.json(data))
});

router.post('/domain/update/', function (req, res) {
  console.dir(req.body);
  QueriesController.updateDomain(req.body)
    .then(res.end("END"))
});


/* ---------- All sensor funtions: -----------------*/
router.get('/sensors', function (req, res) {
  QueriesController.getSensors()
    .then(data => res.json(data))
});

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

router.get('/sensor/:iri', async function (req, res) {
  // console.log(req);
  elements = [];
  firstReq = await QueriesController.getSensor(req.params.iri);
  console.log(firstReq);
  firstReq.forEach(element => {
    console.log(Object.getOwnPropertyNames(element)[0]);
    if (Object.getOwnPropertyNames(element)[0] == 'selement') {
      elements.push(element);
    }
  });

  console.log('array looks like ###########################', elements);
  const start = async () => {
    await asyncForEach(elements, async (selem) => {
      var elem = await QueriesController.getSensorElement(selem.selement.value);
      // elem[0][phenoShort] = elem[0].phenomena.value.slice(34);
      firstReq.push({sensorElements: elem[0]});
    });
    res.json(firstReq);
  }
  start();

  // res.json(firstReq);

  // .then(data => console.log(data))
});


router.get('/sensorIRI/:iri', function (req, res) {
  console.log(req.params.iri);
  QueriesController.getSensorIRI(req.params.iri)
    .then(data => res.json(data))
});

router.post('/sensor/update/', function (req, res) {
  QueriesController.updateSensor(req.body)
    .then(res.end("END"))
});

router.post('/sensor/edit/', function (req, res) {
  QueriesController.editSensor(req.body)
    .then(res.end("END"))
});


/* ---------- All device funtions: -----------------*/
router.get('/devices', function (req, res) {
  QueriesController.getDevices()
    .then(data => res.json(data))
});

router.get('/device/:iri', function (req, res) {
  console.log(req);
  QueriesController.getDevice(req.params.iri)
    .then(data => res.json(data))
});

router.post('/device/update/', function (req, res) {
  console.dir(req.body);
  QueriesController.updateDevice(req.body)
    .then(res.end("END"))
});

router.post('/device/edit/', function (req, res) {
  console.dir(req.body);
  QueriesController.editDevice(req.body)
    .then(res.end("END"))
});

/* --------------------Sensor element functions ------------------------*/

router.get('/sensorElement/:iri', function (req, res) {
  console.log(req);
  QueriesController.getSensorElement(req.params.iri)
    .then(data => res.json(data))
});


/** get all x for a given y */
router.get('/phenomenaforsensor/:iri', function (req, res) {
  QueriesController.getPhenomenaForSensor(req.params.iri)
    .then(data => res.json(data))
});

router.get('/sensorsforphenomenon/:iri', function (req, res) {
  QueriesController.getSensorsForPhenomenon(req.params.iri)
    .then(data => res.json(data))
});

router.get('/sensorsfordevice/:iri', function (req, res) {
  QueriesController.getSensorsForDevice(req.params.iri)
    .then(data => res.json(data))
});

router.get('/phenomenafordomain/:iri', function (req, res) {
  QueriesController.getPhenomenaForDomain(req.params.iri)
    .then(data => res.json(data))
});

router.get('/unitsforphenomenon/:iri', function (req, res) {
  QueriesController.getUnitsForPhenomenon(req.params.iri)
    .then(data => res.json(data))
});


module.exports = router;
