const express = require('express');
const router = express.Router();
router.use(express.json());
const Controller = require('../Controller/controller');
const Mcontroller = require('../Controller/M_controller');
const {Authentication} = require('../middleware/middleware')
const multer = require('multer')
const path = require('path')


//MULTER FOR SELECT IMAGE
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
      callBack(null, "./public/images/"); // directory name where save the file
    },
    filename: (req, file, callBack) => {
      callBack(null,file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
  });
  var upload = multer({
    storage: storage,
  });


//SELECT SECOND IMAGE FOR ACTOR
var location = multer.diskStorage({
    destination: (req, file, callBack) => {
      callBack(null, "./public/images/actor/"); // directory name where save the file
    },
    filename: (req, file, callBack) => {
      callBack(null,file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
  });
  var send = multer({
    storage: location,
  });


//USER DETAILS ROUTES
router.post('/signup',Controller.signup);
router.post('/verify/:id',Controller.verify);
router.post('/login',Controller.login);
router.post('/forgototp',Controller.forgototp);
router.post('/forgot/:id',Controller.forgot);
router.post('/profile',Authentication, upload.single("image"),Controller.editprofile);
router.post('/language',Authentication,Controller.language);
router.post('/feedback',Authentication,Controller.feedback);


//MOVIE ROUTES
router.post('/newmovie',Authentication,upload.single("moviebanner"),Mcontroller.moviedata)
router.post('/newactor',Authentication,send.single("actorphoto"),Mcontroller.actor);
router.post('/deleteactor',Authentication,Mcontroller.deleteactor)
router.post('/updatemovie',Authentication,upload.single("moviebanner"),Mcontroller.updatemovie);
router.post('/screenplay',Authentication,Mcontroller.screenplay);
router.post('/updateactor',Authentication,send.single("actorphoto"),Mcontroller.updateactor);
router.post('/removeactor',Authentication,Mcontroller.removeactor);
router.get('/filter',Authentication,Mcontroller.filter);
router.get('/movie',Authentication,Mcontroller.movie)

 
module.exports = router;  