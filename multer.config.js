const express = require('express');
const multer = require('multer');
const cors = require("cors");
const app = express();
app.use(cors());
 
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "U:/XAMPP/htdocs/media/")
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});
 
var upload = multer({storage: storage, limits: { fieldSize: 25 * 1024 * 1024 }});
 
module.exports = upload;