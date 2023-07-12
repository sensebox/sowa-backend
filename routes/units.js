var express = require("express");
var router = express.Router();

const UnitsController = require("../controllers/units-controller");

// /* GET users listing. */
// router.get("/", function (req, res, next) {
//   res.send("respond with a resource");
// });

/* ---------- All units funtions: -----------------*/
router.get("/", function (req, res) {
  UnitsController.getUnits(req.query.lang).then((data) => {
    return res.json(data);
  });
});

router.get("/:iri", function (req, res) {
  UnitsController.getUnit(req.params.iri, req.query.lang).then((data) => {
    return res.json(data);
  });
});

router.post("/create/", function (req, res) {
  UnitsController.createNewUnit(req.body, res.locals.user.role).then((data) => {
    return res.json(data);
  });
});

router.post("/edit/", function (req, res) {
  UnitsController.editUnit(req.body, res.locals.user.role).then((data) => {
    return res.json(data);
  });
});

router.post("/delete/", function (req, res) {
  UnitsController.deleteUnit(req.body, res.locals.user.role).then((data) => {
    return res.json(data);
  });
});

module.exports = router;
