var express = require('express');
var router = express.Router();
//var bodyParser = require("body-parser");
var Filter = require('../middleware/filter');

const PhenomenaController = require('../controllers/phenomena-controller');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


/* ---------- All phenomenon funtions: -----------------*/
router.get('/all', async function (req, res) {

  PhenomenaController.getPhenomena(req.query.language).then(data => {
    return res.json(data);
  });

});

router.get('/all/labels', function (req, res) {
  PhenomenaController.getPhenomenaAllLabels()
    .then(data => res.json(data))
});

router.get('/phenomenon/:iri', function (req, res) {
  PhenomenaController.getPhenomenon(req.params.iri)
    .then(data => {
      if (req.query.lang) {
        data = Filter.filterData(data, req.query.lang);
      }
      if(req.query.format === 'json'){
        res.json(PhenomenaController.convertPhenomenonToJson(data));
      } else {
        res.json(data)
      }
    })
});

// router.get('/phenomenonDEPRECATED/:iri', function (req, res) {
//   console.log(req);
//   PhenomenaController.getPhenomenonDEPRECATED(req.params.iri)
//     .then(data => res.json(data))
// });

// router.post('/phenomenon/update/', function (req, res) {
//   PhenomenaController.updatePhenomenon(req.body)
//     .then(res.end("END"))
// });

router.get('/historic-phenomenon/:iri', function (req, res) {
  PhenomenaController.getHistoricPhenomenon(req.params.iri)
    .then(data => res.json(data))
});

router.get('/phenomenon-history/:iri', function (req, res) {
  PhenomenaController.getPhenomenonHistory(req.params.iri)
    .then(data => res.json(data))
});

router.post('/phenomenon/create/', function (req, res) {
  PhenomenaController.createNewPhenomenon(req.body, res.locals.user.role)
    .then(data => res.json(data))
  // PhenomenaController.createHistoryPhenomenon(req.body, res.locals.user)
});

router.post('/phenomenon/edit/', function (req, res) {
  PhenomenaController.editPhenomenon(req.body, res.locals.user.role)
     .then(data => res.json(data))
  // PhenomenaController.createHistoryPhenomenon(req.body, res.locals.user)
});

router.post('/phenomenon/delete/', function (req, res) {
  PhenomenaController.deletePhenomenon(req.body, res.locals.user.role)
     .then(data => res.json(data))
});



module.exports = router;
