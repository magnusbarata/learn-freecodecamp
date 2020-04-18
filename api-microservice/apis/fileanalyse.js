// The code for user file analyzer api
const faRouter = require('express').Router();

const multer = require('multer');
const storage = multer.diskStorage({
  destination: 'tmp/uploads',
  filename: function (req, file, cb) {cb(null, file.originalname)}
});
const upload = multer({storage: storage});

faRouter.post('', upload.single('upfile'), (req, res) => {
  try {
    res.send({filename: req.file.originalname, size: req.file.size});
  } catch(err) {
    res.send({status: 400, message: 'bad request'});
  }
});

module.exports = faRouter;