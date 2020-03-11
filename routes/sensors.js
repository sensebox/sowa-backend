var express = require('express');
var router = express.Router();
//var bodyParser = require("body-parser");

const SensorsController = require('../controllers/sensors-controller');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


/* ---------- All sensor funtions: -----------------*/
router.get('/all', function (req, res) {
  SensorsController.getSensors()
    .then(data => res.json(data))
});

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

// router.get('/sensor/:iri', async function (req, res) {
//   // console.log(req);
//   elements = [];
//   firstReq = await SensorsController.getSensor(req.params.iri);
//   console.log(firstReq);
//   firstReq.forEach(element => {
//     console.log(Object.getOwnPropertyNames(element)[0]);
//     if (Object.getOwnPropertyNames(element)[0] == 'selement') {
//       elements.push(element);
//     }
//   });

router.get('/sensor/:iri', function (req, res) {
  console.log(req.params.iri);
  SensorsController.getSensorIRI(req.params.iri)
    .then(data => res.json(data))
});

//   console.log('array looks like ###########################', elements);
//   const start = async () => {
//     await asyncForEach(elements, async (selem) => {
//       var elem = await SensorsController.getSensorElement(selem.selement.value);
//       // elem[0][phenoShort] = elem[0].phenomena.value.slice(34);
//       console.log(elem);
//       firstReq.push({sensorElements: elem[0]});
//     });
//     res.json(firstReq);
//   }
//   start();

//   // res.json(firstReq);

//   // .then(data => console.log(data))
// });


router.get('/sensorIRI/:iri', function (req, res) {
  console.log(req.params.iri);
  SensorsController.getSensorIRI(req.params.iri)
    .then(data => res.json(data))
});

router.post('/sensor/update/', function (req, res) {
  SensorsController.updateSensor(req.body)
    .then(res.send("END"))
});

router.post('/sensor/edit/', function (req, res) {
  console.log(req.body);
  SensorsController.editSensor(req.body);
  SensorsController.createHistorySensor(req.body)
    .then(res.json(req.body))
});



/* --------------------Sensor element functions ------------------------*/

router.get('/sensorElement/:iri', function (req, res) {
  console.log(req);
  SensorsController.getSensorElement(req.params.iri)
    .then(data => res.json(data))
});

module.exports = router;
