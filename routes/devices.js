var express = require('express');
var router = express.Router();
//var bodyParser = require("body-parser");
var Filter = require('../middleware/filter');

const DevicesController = require('../controllers/devices-controller');
const SensorsController = require('../controllers/sensors-controller');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

const prisma = require('../lib/prisma')

/* ---------- All device funtions: -----------------*/
router.get('/all', async function (req, res) {
  const languages = await prisma.language.findMany({
    where: {
      code: req.query.language || "en"
    }
  });
  const result = await prisma.device.findMany({
    select: {
      description: true,
      sensors: true,
      markdown: true,
      validation: true,
      label: {
        select: {
          TranslationItem: {
            select: {
              text: true,
              language: {
                select: {
                  code: true
                }
              }
            },
            where: {
              languageId: languages[0].id
            }
          }
        }
      }
    }
  });
  return res.json(result);
  // DevicesController.getDevices()
  //   .then(data => {
  //     if(req.query.format === 'json'){
  //       return res.json(DevicesController.convertDevicesToJson(data))
  //     } else {
  //       return res.json(data);
  //     }
  //   })
});

router.get('/device/:iri', function (req, res) {
  DevicesController.getDevice(req.params.iri)
    .then(data => {
      if (req.query.lang) {
        data = Filter.filterData(data, req.query.lang);
      }
      if(req.query.format === 'json'){
        return res.json(DevicesController.convertDeviceToJson(data))
      } else {
        return res.json(data);
      }
    })
});

router.get('/device/:iri/sensors', function (req, res) {
  DevicesController.getSensorsOfDevice(req.params.iri)
    .then(data => {
      return res.json(data);
      //Do We need this conversion stuff?
      // if(req.query.format === 'json'){
      //   return res.json(SensorsController.convertSensorsToJson(data))
      // } else {
      //   return res.json(data);
      // }
    })
});

router.get('/all/sensors', function (req, res) {
  DevicesController.getAllSensorsOfAllDevices()
    .then(data => {
      console.log(data);
      return res.json(data);
      //Do We need this conversion stuff?
      // if(req.query.format === 'json'){
      //   return res.json(SensorsController.convertSensorsToJson(data))
      // } else {
      //   return res.json(data);
      // }
    })
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

router.post('/device/delete/', function (req, res) {
  console.log(req.body);
  DevicesController.deleteDevice(req.body, res.locals.user.role)
    .then(res.json(req.body))
});

// router.post('/device/add/', function (req, res) {
//   console.dir(req.body);
//   DevicesController.addDevice(req.body)
//   DevicesController.createHistoryDevice(req.body)
//   .then(data => res.json(data))
// });



module.exports = router;
