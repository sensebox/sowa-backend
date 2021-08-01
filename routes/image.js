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
    console.log("post", req.body);
    if (!req.file) {
        console.log("No file is available!");
        return res.send({
            success: false
        });

    } else {
        // fs.renameSync(req.file.path, req.file.path.replace(req.file.originalname,
        //     req.body.sensorname + "." + req.file.originalname.split(".")[1]));
        // console.log('File is available!');
        return res.send({
            success: true
        })
    }
});

router.get('/:name', async (req, res) => {
    res.sendFile('/public/images/upload/' + req.params.name + "." + "jpg", { root: './' })
})

// async function getFileExtension(name) {
//     fs.readdir("./public/images/upload/", (err, files) => {
//         files.forEach(file => {
//             console.log(file.split(".")[0], name, file.split(".")[1]);
//             if (file.split(".")[0] == name) {
//                 return file.split(".")[1];
//             }
//         });
//     });
// }


module.exports = router;