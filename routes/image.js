var express = require("express");
const multer = require("multer");
const fs = require("fs");
var router = express.Router();

const PATH = "./public/images/upload/";

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PATH);
  },
  filename: (req, file, cb) => {
    console.log("storage", req.body);
    cb(null, file.originalname);
  },
});

let upload = multer({
  storage: storage,
  limits: { files: 1 },
});

let markdownStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/markdown/");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.random + file.originalname);
  },
});

let markdownUpload = multer({
  storage: markdownStorage,
});

router.post("/upload", upload.single("image"), (req, res) => {
  console.log("Additional Parameters: ", req.body);
  if (!req.file) {
    console.log("No file is available!");
    return res.send({
      success: false,
    });
  } else {
    console.log(
      "Endung: " +
        req.file.originalname.slice(req.file.originalname.lastIndexOf("."))
    );
    fs.renameSync(
      req.file.path,
      req.file.path.replace(req.file.originalname, req.body.name)
    );
    console.log("File is available!");
    console.log(req.file);
    return res.send({
      success: true,
    });
  }
});

router.get("/:name", (req, res) => {
  res.sendFile("/public/images/upload/" + req.params.name, { root: "./" });
  // var files = fs.readdirSync('./public/images/upload');
  // files.forEach(element => {
  //     console.log(element);
  //     if(element.split('.')[0] == req.params.name) {
  //         res.sendFile('/public/images/upload/' + element, { root: './' })
  //     }
  // });
});

router.delete("/delete/:name", async (req, res) => {
  console.log(req.body);
  console.log(req.params);

  fs.unlink("./public/images/upload/" + req.params.name, (err) => {
    if (err) {
      console.log(err);
      res.send({ success: false });
    } else {
      console.log("successfully deleted " + req.params.name);
      res.send({ success: true });
    }
  });
});

router.post(
  "/upload/markdown",
  markdownUpload.array("files", 5),
  (req, res) => {
    if (!req.files) {
      console.log("no file available");
      return res.send({
        success: false,
      });
    } else {
      console.log(req.files);
      return res.send({
        success: true,
      });
    }
  }
);

router.get("/markdown/:name", (req, res) => {
  res.sendFile("/public/images/markdown/" + req.params.name, { root: "./" });
});

module.exports = router;
