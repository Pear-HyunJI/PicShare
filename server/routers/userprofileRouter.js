import express from "express";
import multer from "multer";
// import { db } from "../db.js";

const userprofileRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'photo/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


userprofileRouter.post('/uploads', upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No files were uploaded.');
    }
    const imageUrl = 'http://localhost:8001/uploads/' + req.file.filename;
    res.status(200).json({ imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

export default userprofileRouter;
