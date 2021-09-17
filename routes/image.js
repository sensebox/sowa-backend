var express = require('express');
const multer = require('multer');
const fs = require('fs');
var router = express.Router();

const PATH = './public/images/upload/';

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, PATH);
    },
    filename: (req, file, cb) => {
        console.log("storage", req.body);
        cb(null, file.originalname)
    }
});

let upload = multer({
    storage: storage
})

router.post('/upload', upload.single('image'), (req, res) => {
    console.log("Additional Parameters: ", req.body);
    if (!req.file) {
        console.log("No file is available!");
        return res.send({
            success: false
        });

    } else {
        fs.renameSync(req.file.path, req.file.path.replace(req.file.originalname,
            req.body.uri + "." + req.file.originalname.split(".")[1]));
        console.log('File is available!');
        return res.send({
            success: true
        })
    }
});

router.get('/:name', (req, res) => {
    res.sendFile('/public/images/upload/' + req.params.name, { root: './' })
    // var files = fs.readdirSync('./public/images/upload');
    // files.forEach(element => {
    //     console.log(element);
    //     if(element.split('.')[0] == req.params.name) {
    //         res.sendFile('/public/images/upload/' + element, { root: './' })
    //     }
    // });
})

module.exports = router;