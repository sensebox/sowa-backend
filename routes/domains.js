var express = require("express");
var router = express.Router();

const DomainsController = require("../controllers/domains-controller");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

/* ---------- All domain funtions: -----------------*/
router.get("/all", function (req, res) {
  DomainsController.getDomains(req.query.language).then((data) => {
    return res.json(data);
  });
});

router.get("/domain/:iri", function (req, res) {
  DomainsController.getDomain(req.params.iri, req.query.lang).then((data) => {
    return res.json(data);
  });
});

router.post("/domain/create/", function (req, res) {
  DomainsController.createNewDomain(req.body, res.locals.user.role).then((data) => {
    return res.json(data);
  });
});

router.post("/domain/edit/", function (req, res) {
  DomainsController.editDomain(req.body, res.locals.user.role).then((data) => {
    return res.json(data);
  });
});

router.post("/domain/delete/", function (req, res) {
  DomainsController.deleteDomain(req.body, res.locals.user.role).then((data) => {
    return res.json(data);
  });
});

module.exports = router;
