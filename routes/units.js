var express = require("express");
var router = express.Router();

const UnitsController = require("../controllers/units-controller");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

/* ---------- All units funtions: -----------------*/
router.get("/all", function (req, res) {
  UnitsController.getUnits(req.query.lang).then((data) => {
    return res.json(data);
  });
});

router.get("/unit/:iri", function (req, res) {
  UnitsController.getUnit(req.params.iri, req.query.lang).then((data) => {
    return res.json(data);
  });
});

router.post("/unit/create/", function (req, res) {
  UnitsController.createNewUnit(req.body, res.locals.user.role).then((data) => {
    return res.json(data);
  });
});

router.post("/unit/edit/", function (req, res) {
  UnitsController.editUnit(req.body, res.locals.user.role).then((data) => {
    return res.json(data);
  });
});

router.post("/unit/delete/", function (req, res) {
  UnitsController.deleteUnit(req.body, res.locals.user.role).then((data) => {
    return res.json(data);
  });
});

module.exports = router;
