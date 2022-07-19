const express = require('express');
const router = express.Router();
router.use(express.json());
const {Authentication} = require('../middleware/middleware');
const Bcontroller = require('../Controller/B_controller');
const multer = require('multer');
const path = require('path');

//MULTER FOR IMAGE UPLOAD
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
      callBack(null, "./public/images/Bookphoto"); // directory path
    },
    filename: (req, file, callBack) => {
      callBack(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });
  var send = multer({
    storage: storage,
  });

router.post('/newbook',Authentication,send.single("bookphoto"),Bcontroller.bookdata);
router.post('/newact',Authentication,Bcontroller.newact)
router.post('/updatebook',Authentication,send.single("bookphoto"),Bcontroller.updatebook);
router.post('/manuscript',Authentication,Bcontroller.manuscript);
router.post('/updatewriter',Authentication,Bcontroller.updatewriter);
router.post('/removewriter',Authentication,Bcontroller.removewriter);
router.post('/deleteact',Authentication,Bcontroller.deleteact);
router.post('/deletechapter',Authentication,Bcontroller.deletechap);
router.post('/newwriter',Authentication,Bcontroller.writer);
router.post('/deletewriter',Authentication,Bcontroller.deletewriter);
router.get('/filter',Authentication,Bcontroller.filter);
router.get('/bookdetails',Authentication,Bcontroller.book);


module.exports = router;
