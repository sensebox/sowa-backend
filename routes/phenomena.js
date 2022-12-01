var express = require("express");
var router = express.Router();

const PhenomenaController = require("../controllers/phenomena-controller");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

/* ---------- All phenomenon funtions: -----------------*/
router.get("/all", async function (req, res) {
  PhenomenaController.getPhenomena(req.query.language).then((data) => {
    return res.json(data);
  });
});

router.get("/phenomenon/:iri", function (req, res) {
  PhenomenaController.getPhenomenon(req.params.iri, req.query.lang).then((data) => {
      return res.json(data);
  });
});

router.post("/phenomenon/create/", function (req, res) {
  PhenomenaController.createNewPhenomenon(req.body, res.locals.user.role).then((data) => {
    return res.json(data);
  });
});

router.post("/phenomenon/edit/", function (req, res) {
  PhenomenaController.editPhenomenon(req.body, res.locals.user.role).then((data) => {
    return res.json(data);
  });
});

router.post("/phenomenon/delete/", function (req, res) {
  PhenomenaController.deletePhenomenon(req.body, res.locals.user.role).then((data) => {
    return res.json(data);
  });
});

module.exports = router;
