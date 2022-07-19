const express = require('express');
const router = express.Router();
router.use(express.json());
const Scontroller = require('../Controller/S_controller');
const {Authentication} = require('../middleware/middleware')
const multer = require('multer')
const path = require('path')

//SELECT SERIES PHOTO
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
      callBack(null, "./public/images/seriesbanner/"); // directory name where save the file
    },
    filename: (req, file, callBack) => {
      callBack(null,file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
  });
  var upload = multer({
    storage: storage,
  });

//DIFFRENT APIS
router.post('/newseries',Authentication,upload.array('files',5),Scontroller.seriesdata);
router.post('/updateseries',Authentication,upload.array('files',5),Scontroller.updateseries);
router.post('/newseason',Authentication,Scontroller.newseason);
router.post('/deleteseason',Authentication,Scontroller.deleteSeason);
router.post('/newepisode',Authentication,Scontroller.newepisode);
router.post('/screenplay',Authentication,Scontroller.screenplay);
router.post('/updateactor',Authentication,upload.single('actorphoto'),Scontroller.updateactor);
router.post('/removeactor',Authentication,Scontroller.removeactor);
router.post('/newactor',Authentication,upload.single('actorphoto'),Scontroller.actor);
router.post('/deleteactor',Authentication,Scontroller.deleteactor);
router.get('/filter',Authentication,Scontroller.filter);
router.get('/series',Authentication,Scontroller.series);

module.exports = router;