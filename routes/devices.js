var express = require("express");
var router = express.Router();

const DevicesController = require("../controllers/devices-controller");

// /* GET users listing. */
// router.get("/", function (req, res, next) {
//   res.send("respond with a resource");
// });

/* ---------- All device funtions: -----------------*/
router.get("/", async function (req, res) {
  DevicesController.getDevices(req.query.language).then((data) => {
    return res.json(data);
  });
});

router.get("/:iri", async function (req, res) {
  DevicesController.getDevice(req.params.iri, req.query.lang).then((data) => {
    return res.json(data);
  });
});

router.get("/:iri/sensors", function (req, res) {
  DevicesController.getSensorsOfDevice(req.params.iri, req.query.lang).then((data) => {
    return res.json(data);
  });
});

router.post("/create/", function (req, res) {
  DevicesController.createNewDevice(req.body, res.locals.user.role).then((data) => {
    return res.json(data);
  });
});

router.post("/edit/", function (req, res) {
  DevicesController.editDevice(req.body, res.locals.user.role).then((data) => {
    return res.json(data);
  });
});

router.post("/delete/", function (req, res) {
  DevicesController.deleteDevice(req.body, res.locals.user.role).then((data) => {
    return res.json(data);
  });
});

module.exports = router;
