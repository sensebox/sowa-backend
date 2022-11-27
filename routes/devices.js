var express = require("express");
var router = express.Router();

const DevicesController = require("../controllers/devices-controller");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

const prisma = require("../lib/prisma");

/* ---------- All device funtions: -----------------*/
router.get("/all", async function (req, res) {
  DevicesController.getDevices(req.query.language).then((data) => {
    return res.json(data);
  });
});

router.get("/device/:iri", async function (req, res) {
  DevicesController.getDevice(req.params.iri, req.query.lang).then((data) => {
    return res.json(data);
  });
});

router.get("/device/:iri/sensors", function (req, res) {
  DevicesController.getSensorsOfDevice(req.params.iri).then((data) => {
    return res.json(data);
  });
});

router.post("/device/create/", function (req, res) {
  DevicesController.createNewDevice(req.body, res.locals.user.role).then((data) => {
    return res.json(data);
  });
});

router.post("/device/edit/", function (req, res) {
  // console.dir(req.body);
  DevicesController.editDevice(req.body, res.locals.user.role).then((data) => {
    return res.json(data);
  });
});

router.post("/device/delete/", function (req, res) {
  DevicesController.deleteDevice(req.body, res.locals.user.role).then((data) => {
    return res.json(data);
  });
});

module.exports = router;
