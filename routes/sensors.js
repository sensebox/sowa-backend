var express = require("express");
var router = express.Router();

const SensorsController = require("../controllers/sensors-controller");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

/* ---------- All sensor funtions: -----------------*/
router.get("/all", function (req, res) {
  SensorsController.getSensors(req.query.lang).then((data) => {
    return res.json(data);
  });
});

router.get("/sensor/:iri", function (req, res, next) {
  SensorsController.getSensor(req.params.iri, req.query.lang).then((data) => {
    return res.json(data);
  });
});

router.post("/sensor/create/", function (req, res) {
  SensorsController.createNewSensor(req.body).then((data) => {
    return res.json(data);
  });
});

router.post("/sensor/edit/", function (req, res) {
  SensorsController.editSensor(req.body, res.locals.user.role).then((data) => {
    return res.json(data);
  });
});

router.post("/sensor/delete/", function (req, res) {
  SensorsController.deleteSensor(req.body).then((data) => {
    return res.json(data);
  });
});

module.exports = router;
